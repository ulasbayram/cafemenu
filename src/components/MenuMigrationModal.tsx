'use client';

import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, X, FileImage, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MenuMigrationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Cafe object to create menu for */
  cafe: {
    id: string;
    name: string;
  };
  /** Callback when migration is completed successfully */
  onMigrationComplete: () => void;
}

interface MigrationStep {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

/**
 * Modal component for migrating physical menus to digital format using AI
 * Supports both camera capture and file upload functionality
 */
const MenuMigrationModal = ({ 
  isOpen, 
  onClose, 
  cafe, 
  onMigrationComplete 
}: MenuMigrationModalProps) => {
  // State management
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [migrationSteps, setMigrationSteps] = useState<MigrationStep[]>([
    { id: 'upload', title: 'Upload menu images', status: 'pending' },
    { id: 'analyze', title: 'Analyze with AI', status: 'pending' },
    { id: 'create', title: 'Create menu items', status: 'pending' },
  ]);

  // Refs for camera functionality
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();

  /**
   * Update the status of a specific migration step
   */
  const updateStepStatus = useCallback((stepId: string, status: MigrationStep['status']) => {
    setMigrationSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  }, []);

  /**
   * Handle file selection from input
   */
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).filter(file => file.type.startsWith('image/'));
      setSelectedImages(prev => [...prev, ...newImages]);
      updateStepStatus('upload', 'completed');
    }
  }, [updateStepStatus]);

  /**
   * Remove a selected image
   */
  const removeImage = useCallback((index: number) => {
    setSelectedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (newImages.length === 0) {
        updateStepStatus('upload', 'pending');
      }
      return newImages;
    });
  }, [updateStepStatus]);

  /**
   * Start camera for capturing images
   */
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera for menu photos
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        cameraStreamRef.current = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please use file upload instead.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  /**
   * Stop camera and close camera view
   */
  const stopCamera = useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  /**
   * Capture photo from camera
   */
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob and create file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `menu-photo-${Date.now()}.jpg`, {
              type: 'image/jpeg',
            });
            setSelectedImages(prev => [...prev, file]);
            updateStepStatus('upload', 'completed');
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  }, [updateStepStatus, stopCamera]);

  /**
   * Create menu categories and items from AI response
   */
  const createMenuFromData = useCallback(async (menuData: any) => {
    updateStepStatus('create', 'processing');
    
    try {
      // Create categories and items
      for (const categoryData of menuData.categories) {
        // Create category
        const { data: category, error: categoryError } = await supabase
          .from('menu_categories')
          .insert([{
            cafe_id: cafe.id,
            name: JSON.stringify({ 
              en: categoryData.name_en || categoryData.name_tr, 
              tr: categoryData.name_tr || categoryData.name_en 
            }),
            description: JSON.stringify({ 
              en: categoryData.description_en || categoryData.description_tr || null, 
              tr: categoryData.description_tr || categoryData.description_en || null 
            }),
            sort_order: 0,
          }])
          .select()
          .single();

        if (categoryError) throw categoryError;

        // Create items for this category
        for (const [index, itemData] of categoryData.items.entries()) {
          const { error: itemError } = await supabase
            .from('menu_items')
            .insert([{
              category_id: category.id,
              name: JSON.stringify({ 
                en: itemData.name_en || itemData.name_tr, 
                tr: itemData.name_tr || itemData.name_en 
              }),
              description: JSON.stringify({ 
                en: itemData.description_en || itemData.description_tr || null, 
                tr: itemData.description_tr || itemData.description_en || null 
              }),
              price: itemData.price || null,
              is_available: itemData.is_available !== false,
              allergens: Array.isArray(itemData.allergens) ? itemData.allergens : [],
              dietary_tags: Array.isArray(itemData.dietary_tags) ? itemData.dietary_tags : [],
              sort_order: index,
            }]);

          if (itemError) throw itemError;
        }
      }

      updateStepStatus('create', 'completed');
      return true;
    } catch (error) {
      console.error('Error creating menu:', error);
      updateStepStatus('create', 'error');
      throw error;
    }
  }, [cafe.id, updateStepStatus]);

  /**
   * Process selected images and create menu
   */
  const handleMigration = useCallback(async () => {
    if (selectedImages.length === 0) {
      toast({
        title: 'No Images Selected',
        description: 'Please select or capture at least one menu image.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Upload images and analyze with AI
      updateStepStatus('analyze', 'processing');
      
      const formData = new FormData();
      selectedImages.forEach(image => {
        formData.append('images', image);
      });

      const response = await fetch('/api/migrate-menu', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || `Failed to analyze menu images (${response.status})`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze menu');
      }

      updateStepStatus('analyze', 'completed');

      // Step 2: Create menu from AI response
      await createMenuFromData(result.data);

      // Success!
      toast({
        title: 'Migration Successful',
        description: `Successfully created menu with ${result.data.categories.length} categories`,
      });

      onMigrationComplete();
      handleClose();

    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: 'Migration Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      
      // Reset failed steps
      setMigrationSteps(prev => 
        prev.map(step => 
          step.status === 'processing' ? { ...step, status: 'error' } : step
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImages, updateStepStatus, createMenuFromData, onMigrationComplete, toast]);

  /**
   * Close modal and cleanup
   */
  const handleClose = useCallback(() => {
    stopCamera();
    setSelectedImages([]);
    setIsProcessing(false);
    setMigrationSteps([
      { id: 'upload', title: 'Upload menu images', status: 'pending' },
      { id: 'analyze', title: 'Analyze with AI', status: 'pending' },
      { id: 'create', title: 'Create menu items', status: 'pending' },
    ]);
    onClose();
  }, [stopCamera, onClose]);

  /**
   * Render step status icon
   */
  const renderStepIcon = (status: MigrationStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'error':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Migrate Physical Menu with AI</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="space-y-3">
              {migrationSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  {renderStepIcon(step.status)}
                  <span className={`text-sm ${
                    step.status === 'completed' ? 'text-green-600' :
                    step.status === 'processing' ? 'text-blue-600' :
                    step.status === 'error' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            {!showCamera && (
              <>
                {/* Image Upload Options */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={startCamera}
                    disabled={isProcessing}
                  >
                    <Camera className="h-6 w-6" />
                    <span>Use Camera</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    <Upload className="h-6 w-6" />
                    <span>Upload Files</span>
                  </Button>
                </div>

                {/* Selected Images */}
                {selectedImages.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Selected Images ({selectedImages.length})</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedImages.map((image, index) => (
                        <Card key={index} className="relative">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileImage className="h-4 w-4 text-gray-500" />
                                <span className="text-sm truncate">{image.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeImage(index)}
                                disabled={isProcessing}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleMigration} 
                    disabled={selectedImages.length === 0 || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Start Migration'
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Camera View */}
            {showCamera && (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover rounded-lg bg-black"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={stopCamera}>
                    Cancel
                  </Button>
                  <Button onClick={capturePhoto}>
                    Capture Photo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
};

export default MenuMigrationModal;
