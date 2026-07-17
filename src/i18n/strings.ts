export type TransKey = keyof typeof STRINGS

export const STRINGS = {
  appTitle: { en: 'QR Kafem', tr: 'QR Kafem' },
  getStarted: { en: 'Get Started', tr: 'Başla' },
  digitalMenusMadeSimple: { en: 'Digital Menus Made Simple', tr: 'Dijital Menüler Artık Çok Kolay' },
  landingSubtitle: { en: 'Create beautiful QR code menus for your cafe. Let customers scan and browse your menu instantly on their phones.', tr: 'Kafeniz için güzel QR menüler oluşturun. Müşteriler menünüzü anında telefonlarından görüntülesin.' },
  startFreeTrial: { en: 'Start Free Trial', tr: 'Ücretsiz Denemeye Başla' },
  learnMore: { en: 'Learn More', tr: 'Daha Fazla Bilgi' },
  whyChoose: { en: 'Why Choose QR Kafem?', tr: 'Neden QR Kafem?' },
  easyQRGeneration: { en: 'Easy QR Generation', tr: 'Kolay QR Oluşturma' },
  easyQRGenerationDesc: { en: 'Generate QR codes instantly for each table or location in your cafe.', tr: 'Kafenizdeki her masa veya konum için anında QR kodları oluşturun.' },
  mobileOptimized: { en: 'Mobile Optimized', tr: 'Mobil İçin Optimize' },
  mobileOptimizedDesc: { en: 'Beautiful, responsive menus that work perfectly on any device.', tr: 'Her cihazda kusursuz çalışan, şık ve duyarlı menüler.' },
  customerFriendly: { en: 'Customer Friendly', tr: 'Müşteri Dostu' },
  customerFriendlyDesc: { en: 'No app downloads required. Customers just scan and browse.', tr: 'Uygulama indirmeye gerek yok. Müşteriler sadece taratır ve inceler.' },
  howItWorks: { en: 'How It Works', tr: 'Nasıl Çalışır' },
  step1Title: { en: 'Create Your Menu', tr: 'Menünüzü Oluşturun' },
  step1Desc: { en: 'Add your cafe details, menu categories, and items with photos and descriptions.', tr: 'Kafe bilgilerinizi, menü kategorilerinizi ve görsellerle öğelerinizi ekleyin.' },
  step2Title: { en: 'Generate QR Codes', tr: 'QR Kodları Oluşturun' },
  step2Desc: { en: 'Get unique QR codes for your tables that link directly to your menu.', tr: 'Masalarınız için menünüze doğrudan bağlanan benzersiz QR kodları oluşturun.' },
  step3Title: { en: 'Customers Scan & Order', tr: 'Müşteriler Taramaya Başlar' },
  step3Desc: { en: 'Customers scan the QR code and browse your menu on their phones.', tr: 'Müşteriler QR kodu tarar ve menünüzü telefonlarından inceler.' },
  readyToGoDigital: { en: 'Ready to Go Digital?', tr: 'Dijitale Geçmeye Hazır mısınız?' },
  joinHundreds: { en: 'Join cafes already using QR Kafem to serve their customers better.', tr: 'Musterilerine daha iyi hizmet vermek icin QR Kafem kullanan kafelere katilin.' },
    // Dashboard specific translations
    dashboardTitle: { en: 'QR Kafem Dashboard', tr: 'QR Kafem Paneli' },
    settings: { en: 'Settings', tr: 'Ayarlar' },
    signOut: { en: 'Sign Out', tr: 'Çıkış Yap' },
    welcomeToDashboard: { en: 'Welcome to your cafe dashboard', tr: 'Kafe panelinize hoş geldiniz' },
    dashboardSubtitle: { en: 'Create and manage your digital menus with QR codes for easy customer access.', tr: 'Müşteri erişimini kolaylaştırmak için QR kodlarla dijital menülerinizi oluşturun ve yönetin.' },
    
    // Stats cards
    totalCafes: { en: 'Total Cafes', tr: 'Toplam Kafe' },
    qrCodesGenerated: { en: 'QR Codes Generated', tr: 'Oluşturulan QR Kodlar' },
    
    // Cafe management
    yourCafes: { en: 'Your Cafes', tr: 'Kafeleriniz' },
    addNewCafe: { en: 'Add New Cafe', tr: 'Yeni Kafe Ekle' },
    createNewCafe: { en: 'Create New Cafe', tr: 'Yeni Kafe Oluştur' },
    editCafe: { en: 'Edit Cafe', tr: 'Kafe Düzenle' },
    manageMenu: { en: 'Manage Menu', tr: 'Menü Yönet' },
    
    // Empty state
    noCafesYet: { en: 'No cafes yet', tr: 'Henüz kafe yok' },
    getStartedText: { en: 'Get started by creating your first cafe and its digital menu.', tr: 'İlk kafenizi ve dijital menüsünü oluşturarak başlayın.' },
    createFirstCafe: { en: 'Create Your First Cafe', tr: 'İlk Kafenizi Oluşturun' },
    
    // Cafe card details
    noDescription: { en: 'No description', tr: 'Açıklama yok' },
    location: { en: 'Location:', tr: 'Konum:' },
    notSpecified: { en: 'Not specified', tr: 'Belirtilmemiş' },
    
    // Delete confirmation
    deleteCafe: { en: 'Delete Cafe', tr: 'Kafe Sil' },
    deleteConfirmation: { en: 'Are you sure you want to delete', tr: 'silmek istediğinizden emin misiniz' },
    deleteWarning: { en: 'This action cannot be undone and will permanently remove the cafe and all its menu items.', tr: 'Bu işlem geri alınamaz ve kafe ile tüm menü öğelerini kalıcı olarak kaldırır.' },
    cancel: { en: 'Cancel', tr: 'İptal' },
    
    // Success/Error messages
    success: { en: 'Success', tr: 'Başarılı' },
    error: { en: 'Error', tr: 'Hata' },
    cafeDeletedSuccessfully: { en: 'Cafe deleted successfully!', tr: 'Kafe başarıyla silindi!' },
    
    // Menu Management
    backToDashboard: { en: 'Back to Dashboard', tr: 'Panele Dön' },
    menuManagement: { en: 'Menu Management', tr: 'Menü Yönetimi' },
    loadingMenu: { en: 'Loading menu...', tr: 'Menü yükleniyor...' },
    
    // Tabs
    categories: { en: 'Categories', tr: 'Kategoriler' },
    menuItems: { en: 'Menu Items', tr: 'Menü Öğeleri' },
    design: { en: 'Design', tr: 'Tasarım' },
    
    // Categories
    menuCategories: { en: 'Menu Categories', tr: 'Menü Kategorileri' },
    addCategory: { en: 'Add Category', tr: 'Kategori Ekle' },
    createNewCategory: { en: 'Create New Category', tr: 'Yeni Kategori Oluştur' },
    categoryName: { en: 'Category Name', tr: 'Kategori Adı' },
    categoryNamePlaceholder: { en: 'e.g., Appetizers, Main Courses, Desserts', tr: 'ör. Mezeler, Ana Yemekler, Tatlılar' },
    description: { en: 'Description', tr: 'Açıklama' },
    categoryDescriptionPlaceholder: { en: 'Brief description of this category', tr: 'Bu kategorinin kısa açıklaması' },
    createCategory: { en: 'Create Category', tr: 'Kategori Oluştur' },
    noCategoriesYet: { en: 'No categories yet', tr: 'Henüz kategori yok' },
    createFirstCategory: { en: 'Create your first menu category to organize your items.', tr: 'Öğelerinizi düzenlemek için ilk menü kategorinizi oluşturun.' },
    items: { en: 'items', tr: 'öğe' },
    categoryCreatedSuccessfully: { en: 'Category created successfully!', tr: 'Kategori başarıyla oluşturuldu!' },
    
    // Menu Items
    addItem: { en: 'Add Item', tr: 'Öğe Ekle' },
    noCategoriesAvailable: { en: 'No categories available', tr: 'Mevcut kategori yok' },
    needCategoryFirst: { en: 'You need to create at least one category before adding menu items.', tr: 'Menü öğeleri eklemeden önce en az bir kategori oluşturmanız gerekir.' },
    createNewMenuItem: { en: 'Create New Menu Item', tr: 'Yeni Menü Öğesi Oluştur' },
    itemName: { en: 'Item Name', tr: 'Öğe Adı' },
    itemNamePlaceholder: { en: 'e.g., Caesar Salad', tr: 'ör. Sezar Salata' },
    descriptionEnglish: { en: 'Description (English)', tr: 'Açıklama (İngilizce)' },
    descriptionEnglishPlaceholder: { en: 'Fresh romaine lettuce with parmesan cheese and croutons...', tr: 'Parmesan peyniri ve krutonlu taze marul...' },
    descriptionTurkish: { en: 'Açıklama (Türkçe)', tr: 'Açıklama (Türkçe)' },
    descriptionTurkishPlaceholder: { en: 'Parmesan ve krutonlu taze marul...', tr: 'Parmesan ve krutonlu taze marul...' },
    priceUSD: { en: 'Price', tr: 'Fiyat' },
    pricePlaceholder: { en: '12.99', tr: '12.99' },
    available: { en: 'Available', tr: 'Mevcut' },
    category: { en: 'Category', tr: 'Kategori' },
    selectCategory: { en: 'Select a category', tr: 'Bir kategori seçin' },
    image: { en: 'Image', tr: 'Görsel' },
    uploadImageOptional: { en: 'Upload an image of your menu item (optional)', tr: 'Menü öğenizin görselini yükleyin (isteğe bağlı)' },
    createItem: { en: 'Create Item', tr: 'Öğe Oluştur' },
    noItemsInCategory: { en: 'No items in this category yet.', tr: 'Bu kategoride henüz öğe yok.' },
    unavailable: { en: 'Unavailable', tr: 'Mevcut Değil' },
    menuItemCreatedSuccessfully: { en: 'Menu item created successfully!', tr: 'Menü öğesi başarıyla oluşturuldu!' },
    menuItemUpdatedSuccessfully: { en: 'Menu item updated successfully!', tr: 'Menü öğesi başarıyla güncellendi!' },
    menuItemDeletedSuccessfully: { en: 'Menu item deleted successfully!', tr: 'Menü öğesi başarıyla silindi!' },
    
    // Edit Item
    save: { en: 'Save', tr: 'Kaydet' },
    changeImage: { en: 'Change Image', tr: 'Görseli Değiştir' },
    currentImage: { en: 'Current image', tr: 'Mevcut görsel' },
    uploadNewImage: { en: 'Upload a new image to replace the current one (optional)', tr: 'Mevcut görseli değiştirmek için yeni bir görsel yükleyin (isteğe bağlı)' },
    
    // Confirmation
    confirmDeleteItem: { en: 'Are you sure you want to delete', tr: 'silmek istediğinizden emin misiniz' },
    
    // Cafe Form
    cafeName: { en: 'Cafe Name', tr: 'Kafe Adı' },
    cafeNamePlaceholder: { en: 'My Amazing Cafe', tr: 'Harika Kafem' },
    descriptionPlaceholder: { en: 'A cozy place serving the best coffee in town...', tr: 'Şehrin en iyi kahvesini sunan sıcak bir mekan...' },
    locationPlaceholder: { en: '123 Main St, City, State', tr: 'Ana Cadde 123, Şehir, İl' },
    website: { en: 'Website', tr: 'Web Sitesi' },
    websitePlaceholder: { en: 'https://mycafe.com', tr: 'https://kafem.com' },
    email: { en: 'Email', tr: 'E-posta' },
    emailPlaceholder: { en: 'contact@mycafe.com', tr: 'iletisim@kafem.com' },
    phone: { en: 'Phone', tr: 'Telefon' },
    phonePlaceholder: { en: '+1 (555) 123-4567', tr: '+90 (555) 123-4567' },
    updating: { en: 'Updating...', tr: 'Güncelleniyor...' },
    creating: { en: 'Creating...', tr: 'Oluşturuluyor...' },
    updateCafe: { en: 'Update Cafe', tr: 'Kafe Güncelle' },
    createCafe: { en: 'Create Cafe', tr: 'Kafe Oluştur' },
    editCafeDescription: { en: 'Update your cafe information.', tr: 'Kafe bilgilerinizi güncelleyin.' },
    createCafeDescription: { en: 'Add your cafe information to get started with your digital menu.', tr: 'Dijital menünüzle başlamak için kafe bilgilerinizi ekleyin.' },
    mustBeLoggedIn: { en: 'You must be logged in to create a cafe', tr: 'Kafe oluşturmak için giriş yapmalısınız' },
    cafeUpdatedSuccessfully: { en: 'Cafe updated successfully!', tr: 'Kafe başarıyla güncellendi!' },
    cafeCreatedSuccessfully: { en: 'Cafe created successfully!', tr: 'Kafe başarıyla oluşturuldu!' },
    
    // Menu Design
    menuDesign: { en: 'Menu Design', tr: 'Menü Tasarımı' },
    customizeMenuAppearance: { en: 'Customize how your menu looks to customers', tr: 'Menünüzün müşterilere nasıl göründüğünü özelleştirin' },
    loadingDesignSettings: { en: 'Loading design settings...', tr: 'Tasarım ayarları yükleniyor...' },
    reset: { en: 'Reset', tr: 'Sıfırla' },
    useDashboardTheme: { en: 'Use Dashboard Theme', tr: 'Panel Temasını Kullan' },
    saving: { en: 'Saving...', tr: 'Kaydediliyor...' },
    saveDesign: { en: 'Save Design', tr: 'Tasarımı Kaydet' },
    
    // Design Tabs
    colors: { en: 'Colors', tr: 'Renkler' },
    background: { en: 'Background', tr: 'Arka Plan' },
    layout: { en: 'Layout', tr: 'Düzen' },
    
    // Color Presets
    colorPresets: { en: 'Color Presets', tr: 'Renk Şablonları' },
    quickStartColorCombinations: { en: 'Quick start with pre-designed color combinations', tr: 'Önceden tasarlanmış renk kombinasyonlarıyla hızlı başlayın' },
    lightThemes: { en: 'Light Themes', tr: 'Açık Temalar' },
    darkThemes: { en: 'Dark Themes', tr: 'Koyu Temalar' },
    customColors: { en: 'Custom Colors', tr: 'Özel Renkler' },
    fineTuneIndividualColors: { en: 'Fine-tune individual colors', tr: 'Bireysel renkleri ince ayarlayın' },
    
    // Color Labels
    primaryColor: { en: 'Primary Color', tr: 'Ana Renk' },
    accentColor: { en: 'Accent Color', tr: 'Vurgu Rengi' },
    textColor: { en: 'Text Color', tr: 'Metin Rengi' },
    cardBackground: { en: 'Card Background', tr: 'Kart Arka Planı' },
    
    // Background Style
    backgroundStyle: { en: 'Background Style', tr: 'Arka Plan Stili' },
    chooseMenuBackground: { en: 'Choose your menu\'s background appearance', tr: 'Menünüzün arka plan görünümünü seçin' },
    backgroundType: { en: 'Background Type', tr: 'Arka Plan Türü' },
    solidColor: { en: 'Solid Color', tr: 'Düz Renk' },
    gradient: { en: 'Gradient', tr: 'Degrade' },
    imageURL: { en: 'Image (URL)', tr: 'Görsel (URL)' },
    defaultLightBackgrounds: { en: 'Default & Light Backgrounds', tr: 'Varsayılan ve Açık Arka Planlar' },
    darkBackgrounds: { en: 'Dark Backgrounds', tr: 'Koyu Arka Planlar' },
    defaultTheme: { en: 'Default', tr: 'Varsayılan' },
    theme: { en: 'Theme', tr: 'Tema' },
    gradientPresets: { en: 'Gradient Presets', tr: 'Degrade Şablonları' },
    customGradientCSS: { en: 'Custom Gradient CSS', tr: 'Özel Degrade CSS' },
    imageBackground: { en: 'Image Background', tr: 'Görsel Arka Plan' },
    useDefaultTheme: { en: 'Use Default Theme', tr: 'Varsayılan Temayı Kullan' },
    imageBackgroundPlaceholder: { en: 'https://example.com/background.jpg', tr: 'https://ornek.com/arkaplan.jpg' },
    imageBackgroundHelp: { en: 'Use a high-quality image URL. Leave empty to use the default theme background.', tr: 'Yüksek kaliteli bir görsel URL\'si kullanın. Varsayılan tema arka planını kullanmak için boş bırakın.' },
    
    // Typography
    typography: { en: 'Typography', tr: 'Tipografi' },
    adjustTextSizeFont: { en: 'Adjust text size and font settings', tr: 'Metin boyutu ve yazı tipi ayarlarını düzenleyin' },
    headingSize: { en: 'Heading Size', tr: 'Başlık Boyutu' },
    bodyTextSize: { en: 'Body Text Size', tr: 'Gövde Metni Boyutu' },
    small: { en: 'Small', tr: 'Küçük' },
    medium: { en: 'Medium', tr: 'Orta' },
    large: { en: 'Large', tr: 'Büyük' },
    
    // Card Style & Spacing
    cardStyleSpacing: { en: 'Card Style & Spacing', tr: 'Kart Stili ve Aralık' },
    controlLayoutSpacing: { en: 'Control the overall layout and spacing', tr: 'Genel düzen ve aralığı kontrol edin' },
    cardStyle: { en: 'Card Style', tr: 'Kart Stili' },
    spacing: { en: 'Spacing', tr: 'Aralık' },
    modern: { en: 'Modern', tr: 'Modern' },
    classic: { en: 'Classic', tr: 'Klasik' },
    minimal: { en: 'Minimal', tr: 'Minimal' },
    compact: { en: 'Compact', tr: 'Sıkışık' },
    comfortable: { en: 'Comfortable', tr: 'Rahat' },
    relaxed: { en: 'Relaxed', tr: 'Gevşek' },
    
    // Color Preset Names
    warm: { en: 'Warm', tr: 'Sıcak' },
    nature: { en: 'Nature', tr: 'Doğa' },
    ocean: { en: 'Ocean', tr: 'Okyanus' },
    sunset: { en: 'Sunset', tr: 'Gün Batımı' },
    darkMode: { en: 'Dark Mode', tr: 'Koyu Mod' },
    darkPurple: { en: 'Dark Purple', tr: 'Koyu Mor' },
    darkGreen: { en: 'Dark Green', tr: 'Koyu Yeşil' },
    
    // Background Preset Names
    white: { en: 'White', tr: 'Beyaz' },
    lightGray: { en: 'Light Gray', tr: 'Açık Gri' },
    cream: { en: 'Cream', tr: 'Krem' },
    lightBlue: { en: 'Light Blue', tr: 'Açık Mavi' },
    lightGreen: { en: 'Light Green', tr: 'Açık Yeşil' },
    dark: { en: 'Dark', tr: 'Koyu' },
    charcoal: { en: 'Charcoal', tr: 'Kömür Grisi' },
    navy: { en: 'Navy', tr: 'Lacivert' },
    forest: { en: 'Forest', tr: 'Orman' },
    wine: { en: 'Wine', tr: 'Şarap' },
    gradientBlue: { en: 'Gradient Blue', tr: 'Mavi Degrade' },
    gradientSunset: { en: 'Gradient Sunset', tr: 'Gün Batımı Degrade' },
    gradientNature: { en: 'Gradient Nature', tr: 'Doğa Degrade' },
    gradientDark: { en: 'Gradient Dark', tr: 'Koyu Degrade' },
    gradientPurple: { en: 'Gradient Purple', tr: 'Mor Degrade' },
    gradientNight: { en: 'Gradient Night', tr: 'Gece Degrade' },
    
    // Confirmation Dialog
    returnToDefaultDesign: { en: 'Return to Default Design', tr: 'Varsayılan Tasarıma Dön' },
    confirmDefaultDesign: { en: 'Are you sure you want to reset to the dashboard default design? This will replace all your customizations with colors and settings that match the main application theme.', tr: 'Panel varsayılan tasarımına sıfırlamak istediğinizden emin misiniz? Bu, tüm özelleştirmelerinizi ana uygulama temasına uygun renkler ve ayarlarla değiştirecektir.' },
    
    // Success Messages
    designSettingsSavedSuccessfully: { en: 'Design settings saved successfully!', tr: 'Tasarım ayarları başarıyla kaydedildi!' },
    designResetToDefaultSuccessfully: { en: 'Design reset to dashboard default successfully!', tr: 'Tasarım panel varsayılanına başarıyla sıfırlandı!' },
    failedToLoadDesignSettings: { en: 'Failed to load design settings', tr: 'Tasarım ayarları yüklenemedi' },
    
    // Settings Page
    dashboardSettings: { en: 'Dashboard Settings', tr: 'Panel Ayarları' },
    displayName: { en: 'Display name (top right in dashboard)', tr: 'Görünen isim (panelin sağ üstünde)' },
    displayNamePlaceholder: { en: 'e.g., My Cafe Admin', tr: 'ör. Kafe Yöneticim' },
    saveName: { en: 'Save Name', tr: 'İsmi Kaydet' },
    currency: { en: 'Currency', tr: 'Para Birimi' },
    exchangeRate: { en: 'Exchange rate (TRY per 1 USD)', tr: 'Döviz kuru (1 USD karşılığı TRY)' },
    exchangeRatePlaceholder: { en: 'e.g., 35', tr: 'ör. 35' },
    saveRate: { en: 'Save Rate', tr: 'Kuru Kaydet' },
    
    // Auth Page
    qrMenuSystem: { en: 'QR Menu System', tr: 'QR Menü Sistemi' },
    signInToManage: { en: 'Sign in to manage your cafe menus', tr: 'Kafe menülerinizi yönetmek için giriş yapın' },
    signIn: { en: 'Sign In', tr: 'Giriş Yap' },
    signUp: { en: 'Sign Up', tr: 'Kayıt Ol' },
    emailAddress: { en: 'Email address', tr: 'E-posta adresi' },
    password: { en: 'Password', tr: 'Şifre' },
    authEmailPlaceholder: { en: 'Enter your email', tr: 'E-postanızı girin' },
    authPasswordPlaceholder: { en: 'Enter your password', tr: 'Şifrenizi girin' },
    signInButton: { en: 'Sign In', tr: 'Giriş Yap' },
    signUpButton: { en: 'Sign Up', tr: 'Kayıt Ol' },
    checkEmailConfirmation: { en: 'Check your email for confirmation link', tr: 'Onay bağlantısı için e-postanızı kontrol edin' },
    getStartedToday: { en: 'Get Started Today', tr: 'Bugün Başlayın' },
    signingIn: { en: 'Signing in...', tr: 'Giriş yapılıyor...' },
    signingUp: { en: 'Signing up...', tr: 'Kayıt olunuyor...' },
    
    // Bilingual Form Fields
    categoryNameEnglish: { en: 'Category Name (English)', tr: 'Kategori Adı (İngilizce)' },
    categoryNameTurkish: { en: 'Category Name (Türkçe)', tr: 'Kategori Adı (Türkçe)' },
    categoryDescriptionEnglish: { en: 'Category Description (English)', tr: 'Kategori Açıklaması (İngilizce)' },
    categoryDescriptionTurkish: { en: 'Category Description (Türkçe)', tr: 'Kategori Açıklaması (Türkçe)' },
    itemNameEnglish: { en: 'Item Name (English)', tr: 'Öğe Adı (İngilizce)' },
    itemNameTurkish: { en: 'Item Name (Türkçe)', tr: 'Öğe Adı (Türkçe)' },
    categoryNameEnglishPlaceholder: { en: 'e.g., Appetizers', tr: 'ör. Mezeler' },
    categoryNameTurkishPlaceholder: { en: 'e.g., Mezeler', tr: 'ör. Mezeler' },
    categoryDescEnglishPlaceholder: { en: 'Brief description in English', tr: 'İngilizce kısa açıklama' },
    categoryDescTurkishPlaceholder: { en: 'Brief description in Turkish', tr: 'Türkçe kısa açıklama' },
    itemNameEnglishPlaceholder: { en: 'e.g., Caesar Salad', tr: 'ör. Sezar Salata' },
    itemNameTurkishPlaceholder: { en: 'e.g., Sezar Salata', tr: 'ör. Sezar Salata' },
    
    // Category Management
    editCategory: { en: 'Edit Category', tr: 'Kategoriyi Düzenle' },
    deleteCategory: { en: 'Delete Category', tr: 'Kategoriyi Sil' },
    updateCategory: { en: 'Update Category', tr: 'Kategoriyi Güncelle' },
    deleteCategoryConfirmation: { en: 'Are you sure you want to delete this category?', tr: 'Bu kategoriyi silmek istediğinizden emin misiniz?' },
    deleteCategoryWarning: { en: 'This will also delete all menu items in this category. This action cannot be undone.', tr: 'Bu işlem bu kategorideki tüm menü öğelerini de silecektir. Bu işlem geri alınamaz.' },
    categoryDeletedSuccessfully: { en: 'Category deleted successfully!', tr: 'Kategori başarıyla silindi!' },
    categoryUpdatedSuccessfully: { en: 'Category updated successfully!', tr: 'Kategori başarıyla güncellendi!' },
    
} as const


