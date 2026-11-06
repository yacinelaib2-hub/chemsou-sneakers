document.addEventListener("DOMContentLoaded", () => {
    const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
    const copy = {
        fr: {
            siteTitle: "Chemsou Sneakers | Baskets & Streetwear Algérie",
            announcement: "🔥 CHEMSOU SNEAKERS & STREETWEAR — LIVRAISON 69 WILAYAS (ORAN, ALGER...)",
            menuOpen: "Ouvrir le menu",
            search: "Recherche",
            languageSelect: "Choisir la langue",
            switchToArabic: "Passer en arabe",
            switchToFrench: "Passer en français",
            profileAdmin: "Tableau de bord admin",
            profileMember: "Mon profil",
            profileGuest: "Connexion ou inscription",
            cart: "Panier",
            close: "Fermer",
            shop: "BOUTIQUE",
            home: "Accueil",
            sneakers: "Baskets (Sneakers)",
            clothes: "Vêtements & Ensembles",
            accessories: "Accessoires",
            contactDelivery: "Contact & livraison",
            mySpace: "MON ESPACE",
            helpSocial: "Aide & réseaux sociaux",
            logout: "Se déconnecter",
            searchPlaceholder: "Rechercher une paire, un ensemble, une marque...",
            clearSearch: "Effacer la recherche",
            season: "CHEMSOU SNEAKERS & STREETWEAR / 2026",
            heroTitleFirst: "CHEMSOU",
            heroTitleSecond: "SNEAKERS.",
            heroText: "Baskets tendance, ensembles streetwear et nouveautés exclusives en Algérie. Livraison 69 Wilayas.",
            shopNow: "DÉCOUVRIR LA BOUTIQUE →",
            cardNew: "NOUVEAU",
            collection: "COLLECTION EXCLUSIVE · 69 WILAYAS",
            sneakersAndClothes: "SNEAKERS & STREETWEAR",
            chooseBrand: "Choisir une marque",
            selection: "NOTRE SÉLECTION",
            latestDrops: "Nouveautés & Tendances",
            filters: "FILTRES ☰",
            category: "Catégorie",
            all: "Tout",
            brand: "Marque",
            gender: "Genre",
            male: "Homme",
            female: "Femme",
            unisex: "Unisexe",
            size: "Pointure / Taille",
            sizeAll: "Toutes les tailles",
            maxPrice: "Prix maximum",
            sortBy: "Trier par",
            sortNew: "Nouveautés",
            sortPriceLow: "Prix : croissant",
            sortPriceHigh: "Prix : décroissant",
            sortName: "Nom A-Z",
            clickDetails: "Sélectionne un article pour voir les détails",
            favorite: "Ajouter aux favoris",
            sale: "PROMO",
            quickView: "APERÇU RAPIDE",
            stockIn: "Disponible en stock",
            stockOut: "Rupture de stock",
            addToCart: "AJOUTER AU PANIER",
            noProducts: "Aucun produit trouvé",
            noProductsHelp: "Essaie une autre recherche ou enlève quelques filtres.",
            promoEyebrow: "CHEMSOU SNEAKERS & STREETWEAR",
            promoFirst: "Ta paire et ton ensemble.",
            promoSecond: "Directement chez toi.",
            discover: "DÉCOUVRIR LE CATALOGUE →",
            needHelp: "BESOIN D’AIDE ? COMMANDES & INFOS",
            contactTitle: "Contacte Chemsou Sneakers",
            contactText: "Point de vente à Aïn El Turk (Oran) & livraison rapide dans les 69 wilayas d'Algérie. Pour réserver ta taille ou passer commande : contacte-nous directement.",
            whatsapp: "WhatsApp (05 40 75 50 98) →",
            facebook: "Facebook →",
            instagram: "Instagram (@chemsou_sneakers) →",
            phoneCall: "Appeler le 05 40 75 50 98 →",
            footerTagline: "Boutique de baskets & streetwear de référence en Algérie. Livraison 69 Wilayas.",
            newArrivals: "Nouveautés",
            promotions: "Promotions",
            information: "INFORMATIONS",
            contact: "Contact & Localisation",
            delivery: "Suivi de commande",
            terms: "Conditions",
            administration: "Administration",
            follow: "SUIVEZ-NOUS",
            rights: "Tous droits réservés.",
            cartTitle: "Votre panier",
            emptyCart: "Votre panier est vide.",
            continueShopping: "CONTINUER MES ACHATS",
            checkout: "COMMANDER",
            chooseSize: "Choisir une taille",
            sizeGuide: "Guide des tailles (Baskets & Vêtements)",
            sizeGuideText: "Baskets : 39 (24.5 cm) à 45 (29 cm) · Vêtements : S (88-96cm), M (96-104cm), L (104-112cm), XL (112-124cm), XXL (124-136cm).",
            cashOnDelivery: "PAIEMENT À LA LIVRAISON (69 WILAYAS)",
            shippingInfo: "Informations de livraison",
            fullName: "Nom complet",
            phone: "Numéro de téléphone",
            phonePlaceholder: "05 / 06 / 07...",
            province: "Wilaya",
            chooseProvince: "Choisir une wilaya",
            municipality: "Commune",
            cashNote: "Paiement en espèces à la réception de votre commande.",
            confirmOrder: "CONFIRMER LA COMMANDE",
            stockCount: "{count} en stock",
            productCount: "{count} produit{plural}",
            itemSize: "Taille",
            remove: "Supprimer",
            sending: "Envoi de la commande...",
            orderSuccess: "Commande {number} enregistrée. Paiement à la livraison.",
            orderFailure: "Commande impossible.",
            networkError: "Erreur réseau. Réessaie.",
            unavailable: "La boutique est temporairement indisponible.",
            loginRequired: "Connecte-toi à ton compte client pour commander.",
            stockError: "Stock insuffisant pour ce produit ou cette taille.",
            changedStock: "Le stock vient de changer. Vérifie ton panier.",
            itemInvalid: "Un article du panier est invalide.",
            photoLabel: "Photo {count}",
            fieldsError: "Vérifie les informations saisies.",
            total: "Total",
            orderSummary: "Récapitulatif de la commande",
            itemsSubtotal: "Articles",
            deliveryTo: "Livraison vers",
            deliveryFee: "Frais de livraison",
            finalTotal: "Total de la commande",
            enterDestination: "Saisis d’abord ta wilaya et ta commune",
            orderSuccess: "Commande {number} enregistrée. Livraison vers {destination} : {fee}. Total : {total}. Paiement à la livraison.",
            installApp: "Installer l’application Chemsou Sneakers",
            installEyebrow: "CHEMSOU SNEAKERS SUR TON TÉLÉPHONE",
            installTitle: "Installer Chemsou Sneakers",
            installNow: "Installer maintenant",
            installAndroid: "Sur Chrome, appuie sur ⋮ puis « Installer l’application » ou « Ajouter à l’écran d’accueil », puis confirme.",
            installIos: "Dans Safari, appuie sur Partager □ puis « Sur l’écran d’accueil », et confirme avec « Ajouter ».",
            installDesktop: "Dans le menu du navigateur, choisis « Installer Chemsou Sneakers » ou « Ajouter à l’écran d’accueil ».",
            installPlatformAndroid: "Android · Chrome",
            installPlatformIos: "iPhone / iPad · Safari",
            installPlatformDesktop: "Installation sur cet appareil",
            understood: "Compris",
            appInstalled: "Chemsou Sneakers est installé sur cet appareil.",
            installNoticeTitle: "Installe Chemsou Sneakers",
            installNoticeText: "Retrouve la boutique facilement depuis ton écran d’accueil.",
            installLater: "Plus tard",
            installIosHint: "Dans Safari : Partager → Sur l’écran d’accueil.",
            installUnavailableHint: "Ouvre la boutique dans Chrome et vérifie que la connexion est sécurisée pour installer l’application.",
            installTryAgain: "Installation annulée. Tu peux réessayer quand tu veux.",
            sport: "Sport"
        },
        ar: {
            siteTitle: "Chemsou Sneakers | أحذية وملابس الشارع في الجزائر",
            announcement: "🔥 تشكيلة شمسو سنيكرز الجديدة — أحذية وملابس — التوصيل 69 ولاية",
            menuOpen: "افتح القائمة",
            search: "بحث",
            languageSelect: "اختر اللغة",
            switchToArabic: "التبديل إلى العربية",
            switchToFrench: "Passer en français",
            profileAdmin: "لوحة الإدارة",
            profileMember: "حسابي",
            profileGuest: "تسجيل الدخول أو إنشاء حساب",
            cart: "السلة",
            close: "إغلاق",
            shop: "المتجر",
            home: "الرئيسية",
            sneakers: "أحذية رياضية",
            clothes: "ملابس وأطقم رياضية",
            accessories: "إكسسوارات",
            contactDelivery: "التواصل والتوصيل",
            mySpace: "حسابي",
            helpSocial: "المساعدة والشبكات الاجتماعية",
            logout: "تسجيل الخروج",
            searchPlaceholder: "ابحث عن حذاء، طقم، أو علامة تجارية...",
            clearSearch: "مسح البحث",
            season: "تشكيلة شمسو سنيكرز / 2026",
            heroTitleFirst: "شمسو",
            heroTitleSecond: "سنيكرز.",
            heroText: "أحدث الأحذية الرياضية وأطقم ملابس الشارع في الجزائر — وهران والتوصيل لكافة الـ 69 ولاية.",
            shopNow: "اكتشف المتجر ←",
            cardNew: "جديد",
            collection: "تشكيلة حصرية · 69 ولاية",
            sneakersAndClothes: "سنيكرز وملابس الشارع",
            chooseBrand: "اختر علامة تجارية",
            selection: "اختياراتنا",
            latestDrops: "أحدث المنتجات والترندات",
            filters: "الفلاتر ☰",
            category: "الفئة",
            all: "الكل",
            brand: "العلامة التجارية",
            gender: "الجنس",
            male: "رجالي",
            female: "نسائي",
            unisex: "للجنسين",
            size: "المقاس",
            sizeAll: "كل المقاسات",
            maxPrice: "السعر الأقصى",
            sortBy: "ترتيب حسب",
            sortNew: "الأحدث",
            sortPriceLow: "السعر: من الأقل إلى الأعلى",
            sortPriceHigh: "السعر: من الأعلى إلى الأقل",
            sortName: "الاسم أ-ي",
            clickDetails: "اختر منتجاً لعرض التفاصيل",
            favorite: "أضف إلى المفضلة",
            sale: "تخفيض",
            quickView: "عرض سريع",
            stockIn: "متوفر في المخزون",
            stockOut: "نفد من المخزون",
            addToCart: "أضف إلى السلة",
            noProducts: "لم يتم العثور على منتجات",
            noProductsHelp: "جرّب بحثاً آخر أو أزل بعض الفلاتر.",
            promoEyebrow: "شمسو سنيكرز وستريت وير",
            promoFirst: "حذاؤك وطقمك المفضل.",
            promoSecond: "توصيل حتى باب منزلك.",
            discover: "اكتشف الكتالوج ←",
            needHelp: "تحتاج مساعدة؟ تواصل معنا",
            contactTitle: "تواصل مع شمسو سنيكرز",
            contactText: "المحل في عين الترك (وهران) والتوصيل السريع لجميع الـ 69 ولاية. للطلب أو حجز مقاسك تواصل معنا مباشرة.",
            whatsapp: "واتساب (0540755098) ←",
            facebook: "فيسبوك ←",
            instagram: "إنستغرام (@chemsou_sneakers) ←",
            phoneCall: "اتصال بالهاتف (0540755098) ←",
            footerTagline: "متجر شمسو سنيكرز — وجهتك الأولى للأحذية وملابس الشارع في الجزائر.",
            newArrivals: "وصل حديثاً",
            promotions: "التخفيضات",
            information: "معلومات",
            contact: "اتصل بنا والموقع",
            delivery: "متابعة الطلب",
            terms: "الشروط والأحكام",
            administration: "الإدارة",
            follow: "تابعنا",
            rights: "جميع الحقوق محفوظة.",
            cartTitle: "سلة التسوق",
            emptyCart: "سلتك فارغة.",
            continueShopping: "متابعة التسوق",
            checkout: "إتمام الطلب",
            chooseSize: "اختر المقاس",
            sizeGuide: "دليل المقاسات (الأحذية والملابس)",
            sizeGuideText: "الأحذية: من 39 إلى 45 · الملابس: S, M, L, XL, XXL.",
            cashOnDelivery: "الدفع عند الاستلام (69 ولاية)",
            shippingInfo: "معلومات التوصيل",
            fullName: "الاسم الكامل",
            phone: "رقم الهاتف",
            phonePlaceholder: "05 / 06 / 07...",
            province: "الولاية",
            chooseProvince: "اختر الولاية",
            municipality: "البلدية",
            cashNote: "الدفع نقداً عند استلام طلبك.",
            confirmOrder: "تأكيد الطلب",
            stockCount: "متوفر: {count}",
            productCount: "{count} منتج",
            itemSize: "المقاس",
            remove: "حذف",
            sending: "جارٍ إرسال الطلب...",
            orderSuccess: "تم تسجيل الطلب {number}. التوصيل إلى {destination}، المصاريف {fee}، المجموع {total}. الدفع عند الاستلام.",
            orderFailure: "تعذر إتمام الطلب.",
            networkError: "خطأ في الاتصال. حاول مجدداً.",
            unavailable: "المتجر غير متاح مؤقتاً.",
            loginRequired: "سجّل الدخول إلى حسابك لإتمام الطلب.",
            stockError: "المخزون غير كافٍ لهذا المنتج أو المقاس.",
            changedStock: "تغير المخزون. تحقق من سلتك.",
            itemInvalid: "أحد المنتجات في السلة غير صالح.",
            photoLabel: "الصورة {count}",
            fieldsError: "تحقق من المعلومات التي أدخلتها.",
            total: "المجموع",
            orderSummary: "ملخص الطلب",
            itemsSubtotal: "المنتجات",
            deliveryTo: "التوصيل إلى",
            deliveryFee: "مصاريف التوصيل",
            finalTotal: "المجموع النهائي",
            enterDestination: "أدخل الولاية والبلدية أولاً",
            installApp: "ثبّت تطبيق Chemsou",
            installEyebrow: "CHEMSOU SNEAKERS على هاتفك",
            installTitle: "تثبيت تطبيق Chemsou Sneakers",
            installNow: "ثبّت الآن",
            installAndroid: "في Chrome اضغط على ⋮ ثم «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»، وبعدها أكّد.",
            installIos: "في Safari اضغط على زر المشاركة □ ثم «إضافة إلى الشاشة الرئيسية»، وبعدها اضغط «إضافة».",
            installDesktop: "من قائمة المتصفح اختر «تثبيت Chemsou Sneakers» أو «إضافة إلى الشاشة الرئيسية».",
            installPlatformAndroid: "Android · Chrome",
            installPlatformIos: "iPhone / iPad · Safari",
            installPlatformDesktop: "التثبيت على هذا الجهاز",
            understood: "فهمت",
            appInstalled: "تم تثبيت Chemsou Sneakers على هذا الجهاز.",
            installNoticeTitle: "ثبّت تطبيق Chemsou Sneakers",
            installNoticeText: "افتح متجر شمسو سنيكرز بسرعة من الشاشة الرئيسية لهاتفك.",
            installLater: "لاحقاً",
            installIosHint: "في Safari: مشاركة ← إضافة إلى الشاشة الرئيسية.",
            installUnavailableHint: "افتح المتجر في Chrome وتأكد من أن الاتصال آمن لتثبيت التطبيق.",
            installTryAgain: "تم إلغاء التثبيت. يمكنك المحاولة مرة أخرى.",
            sport: "رياضة"
        }
    };

    const productDescriptions = {
        "La silhouette légendaire Air Max Plus TN avec amorti Tuned Air et cage nervurée emblématique.": {
            fr: "La silhouette légendaire Air Max Plus TN avec amorti Tuned Air et cage nervurée emblématique.",
            ar: "حذاء Air Max Plus TN الأسطوري بنظام Tuned Air وتصميم القفص المميز لإطلالة قوية."
        },
        "L'incontournable Jordan 4 aux empiècements en cuir premium et détails mesh bicolores.": {
            fr: "L'incontournable Jordan 4 aux empiècements en cuir premium et détails mesh bicolores.",
            ar: "حذاء جوردان 4 الشهير بجلد فاخر وتفاصيل شبكية بلونين."
        },
        "La paire streetwear par excellence, coupe basse bicolore noir et blanc ultra polyvalente.": {
            fr: "La paire streetwear par excellence, coupe basse bicolore noir et blanc ultra polyvalente.",
            ar: "حذاء ستريت وير الأيقوني بتصميم كلاسيكي أبيض وأسود يناسب كل إطلالاتك."
        },
        "Le grand classique intemporel en cuir blanc lisse avec semelle cupsole cousue.": {
            fr: "Le grand classique intemporel en cuir blanc lisse avec semelle cupsole cousue.",
            ar: "الحذاء الكلاسيكي الخالد بجلد أبيض ناعم ونعل متين وخياطة محكمة."
        },
        "Silhouette skate rétro avec lacets larges et daim doux haut de gamme.": {
            fr: "Silhouette skate rétro avec lacets larges et daim doux haut de gamme.",
            ar: "تصميم تزلج كلاسيكي بأربطة عريضة وجلد سويد فاخر."
        },
        "Design rétro basketball des années 80 avec cuir perforé et semelle en caoutchouc durable.": {
            fr: "Design rétro basketball des années 80 avec cuir perforé et semelle en caoutchouc durable.",
            ar: "تصميم كلاسيكي مستوحى من كرة السلة في الثمانينات براحة وجودة عالية."
        },
        "Superpositions anatomiques mythiques et double amorti Air visible à l'avant et au talon.": {
            fr: "Superpositions anatomiques mythiques et double amorti Air visible à l'avant et au talon.",
            ar: "طبقات مميزة مستوحاة من تشريح الجسم مع وحدة Air المزدوجة لراحة فائقة."
        },
        "Court-inspired style iconique conçu pour un look urbain quotidien.": {
            fr: "Court-inspired style iconique conçu pour un look urbain quotidien.",
            ar: "تصميم رياضي كلاسيكي مستوحى من الملاعب لإطلالة شوارع يومية."
        },
        "Survêtement complet Nike Tech Fleece premium avec zip double sens, poches thermocollées et coupe ajustée.": {
            fr: "Survêtement complet Nike Tech Fleece premium avec zip double sens, poches thermocollées et coupe ajustée.",
            ar: "طقم نايكي تك فليس كامل الأصلي بسحاب مزدوج وجيوب حرارية وقصة أنيقة."
        },
        "Ensemble de survêtement en taffetas diamanté respirant avec crocodile vert emblématique brodé.": {
            fr: "Ensemble de survêtement en taffetas diamanté respirant avec crocodile vert emblématique brodé.",
            ar: "طقم رياضي لاكوست فاخر من قماش التافتا الماسي خفيف الوزن ومقاوم مع تطريز التمساح الأخضر."
        },
        "Veste légère hydrofuge avec le légendaire chevron à 26 degrés et doublure en mesh respirant.": {
            fr: "Veste légère hydrofuge avec le légendaire chevron à 26 degrés et doublure en mesh respirant.",
            ar: "سترة نايكي خفيفة ومقاومة للماء بتصميم الشيفرون الكلاسيكي وبطانة شبكية مريحة."
        },
        "Sweat à capuche en molleton doux brossé, coupe décontractée moderne et logo Nike Futura brodé.": {
            fr: "Sweat à capuche en molleton doux brossé, coupe décontractée moderne et logo Nike Futura brodé.",
            ar: "هودي دافئ من الصوف الناعم بقصة واسعة مريحة وتطريز شعار نايكي المميز."
        },
        "Pantalon cargo technique multipoches avec chevilles resserrées et taille ajustable par cordon.": {
            fr: "Pantalon cargo technique multipoches avec chevilles resserrées et taille ajustable par cordon.",
            ar: "سروال كارجو عملي بعدة جيوب مع أساور كاحل مطاطية وحزام خصر قابل للتعديل."
        },
        "T-shirt en coton épais 100% lourd avec coupe boxy tombante et graphisme Air Max sur la poitrine.": {
            fr: "T-shirt en coton épais 100% lourd avec coupe boxy tombante et graphisme Air Max sur la poitrine.",
            ar: "تيشيرت قطن ثقيل 100% بقصة بوكسي عصرية وطبعة Air Max على الصدر."
        },
        "L'incontournable ensemble gris chiné Nike Tech Fleece alliant chaleur légère et style streetwear affûté.": {
            fr: "L'incontournable ensemble gris chiné Nike Tech Fleece alliant chaleur légère et style streetwear affûté.",
            ar: "طقم نايكي تك فليس الرمادي الكلاسيكي يوفر الدفء والراحة مع طابع ستريت وير عصري."
        },
        "Veste sans manches matelassée rembourrée pour la mi-saison avec col montant et zip intégral.": {
            fr: "Veste sans manches matelassée rembourrée pour la mi-saison avec col montant et zip intégral.",
            ar: "سترة مبطنة بدون أكمام مثالية لمختلف الفصول مع ياقة عالية وسحاب كامل."
        }
    };

    const localizedDescription = description => productDescriptions[description]?.[language] || description;
    let language = localStorage.getItem("chemsouLanguage") || localStorage.getItem("musLockerLanguage") || "fr";
    if (language !== "ar" && language !== "fr") language = "fr";

    const t = (key, values = {}) => (copy[language][key] || copy.fr[key] || key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
    const money = value => `${Number(value).toLocaleString("fr-FR")} ${language === "ar" ? "دج" : "DA"}`;

    function applyLanguage() {
        document.documentElement.lang = language;
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
        document.querySelectorAll("[data-i18n]").forEach(element => {
            element.textContent = t(element.dataset.i18n);
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
            element.placeholder = t(element.dataset.i18nPlaceholder);
        });
        document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
            element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
        });
        document.querySelectorAll("[data-i18n-title]").forEach(element => {
            element.title = t(element.dataset.i18nTitle);
        });
        document.querySelectorAll("[data-category-label]").forEach(element => {
            const categories = {"Sneakers": "sneakers", "Vêtements": "clothes", "Accessoires": "accessories", "Sport": "sport"};
            element.textContent = t(categories[element.dataset.categoryLabel] || "category");
        });
        document.querySelectorAll(".product-description").forEach(element => {
            const product = products.find(item => String(item.id) === element.closest(".product-card")?.dataset.id);
            if (product) element.textContent = localizedDescription(product.description);
        });
        document.querySelectorAll(".price-line strong, .price-line del").forEach(element => {
            element.dataset.priceAmount ||= element.textContent.replace(/\s*DA$/, "").replace(/\s*دج$/, "");
            element.textContent = `${element.dataset.priceAmount} ${language === "ar" ? "دج" : "DA"}`;
        });
        const cartTotal = document.getElementById("cartTotal");
        if (cartTotal) {
            cartTotal.dataset.priceAmount ||= cartTotal.textContent.replace(/\D/g, "");
            cartTotal.textContent = money(cartTotal.dataset.priceAmount);
        }
        const languageSwitch = document.getElementById("languageSwitch");
        if (languageSwitch) {
            languageSwitch.dataset.language = language;
            languageSwitch.querySelectorAll(".language-option").forEach(option => {
                option.setAttribute("aria-pressed", String(option.dataset.languageOption === language));
            });
        }
        document.getElementById("languageCode").textContent = language.toUpperCase();
        document.title = t("siteTitle");
    }

    function setLanguage(nextLanguage) {
        if (!copy[nextLanguage] || nextLanguage === language) return;
        language = nextLanguage;
        localStorage.setItem("chemsouLanguage", language);
        applyLanguage();
        renderProducts();
        renderCart();
        updateCheckoutSummary();
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            document.body.animate(
                [{opacity: 0.84, transform: "translateY(3px)"}, {opacity: 1, transform: "translateY(0)"}],
                {duration: 280, easing: "cubic-bezier(.2,.7,.2,1)"}
            );
        }
    }

    let deferredInstallPrompt = null;
    const installNotice = document.getElementById("installNotice");
    const installNoticeButton = document.getElementById("installNoticeButton");
    const installNoticeFeedback = document.getElementById("installNoticeFeedback");
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isInstalledApp = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true || localStorage.getItem("chemsouInstalled") === "yes";

    window.addEventListener("beforeinstallprompt", event => {
        event.preventDefault();
        deferredInstallPrompt = event;
    });
    window.addEventListener("appinstalled", () => {
        localStorage.setItem("chemsouInstalled", "yes");
        deferredInstallPrompt = null;
        if (installNotice) installNotice.hidden = true;
    });
    installNoticeButton?.addEventListener("click", async () => {
        if (deferredInstallPrompt && !isIOS) {
            const promptEvent = deferredInstallPrompt;
            deferredInstallPrompt = null;
            installNoticeButton.disabled = true;
            try {
                await promptEvent.prompt();
                const choice = await promptEvent.userChoice;
                if (choice.outcome === "accepted") {
                    localStorage.setItem("chemsouInstalled", "yes");
                    installNotice.hidden = true;
                } else {
                    installNoticeFeedback.textContent = t("installTryAgain");
                    installNoticeFeedback.hidden = false;
                }
            } catch {
                installNoticeFeedback.textContent = t("installUnavailableHint");
                installNoticeFeedback.hidden = false;
            } finally {
                installNoticeButton.disabled = false;
            }
            return;
        }
        installNoticeFeedback.textContent = t(isIOS ? "installIosHint" : "installUnavailableHint");
        installNoticeFeedback.hidden = false;
    });
    document.querySelectorAll("[data-install-later]").forEach(button => button.addEventListener("click", () => {
        if (installNotice) installNotice.hidden = true;
    }));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && installNotice && !installNotice.hidden) installNotice.hidden = true;
    });

    document.querySelectorAll(".language-option").forEach(option => {
        option.addEventListener("click", () => setLanguage(option.dataset.languageOption));
    });

    let cart = JSON.parse(localStorage.getItem("chemsouCart") || localStorage.getItem("urbanKicksCart") || "[]");
    let favorites = JSON.parse(localStorage.getItem("chemsouFavorites") || localStorage.getItem("urbanKicksFavorites") || "[]");

    const productGrid = document.getElementById("productGrid");
    const resultCount = document.getElementById("resultCount");
    const emptyState = document.getElementById("emptyState");
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");
    let promoOnly = false;

    function save() {
        localStorage.setItem("chemsouCart", JSON.stringify(cart));
        localStorage.setItem("chemsouFavorites", JSON.stringify(favorites));
    }

    function renderProducts() {
        const term = (searchInput?.value || "").toLowerCase().trim();
        const category = document.querySelector('input[name="category"]:checked')?.value || "all";
        const brands = [...document.querySelectorAll(".brand-filter:checked")].map(x => x.value);
        document.querySelectorAll(".brand-chip").forEach(chip => {
            const selected = brands.includes(chip.dataset.brandFilter);
            chip.classList.toggle("active", selected);
            chip.setAttribute("aria-pressed", String(selected));
        });
        document.querySelectorAll(".store-nav a").forEach(link => {
            const cat = link.dataset.categoryFilter;
            const sortFilter = link.dataset.sortFilter;
            const active = link.dataset.promoFilter
                ? promoOnly
                : cat
                    ? document.querySelector('input[name="category"]:checked')?.value === cat
                    : sortFilter === "new" && sortSelect?.value === "new";
            link.classList.toggle("active", Boolean(active));
        });
        const genders = [...document.querySelectorAll(".gender-filter:checked")].map(x => x.value);
        const size = document.getElementById("sizeFilter")?.value || "";
        const sort = sortSelect?.value || "new";

        let filtered = products.filter(p => {
            const matchesSearch =
                !term ||
                String(p.name).toLowerCase().includes(term) ||
                String(p.brand).toLowerCase().includes(term) ||
                String(p.category).toLowerCase().includes(term);

            const matchesCategory = category === "all" || p.category === category;
            const matchesBrand = brands.length === 0 || brands.includes(p.brand);
            const matchesGender = genders.length === 0 || genders.includes(p.gender || "Homme");
            const availableSizes = (p.sizes || []).filter(item => Number(item.stock) > 0).map(item => String(item.size));
            const matchesSize = !size || availableSizes.includes(size);
            const matchesPromo = !promoOnly || Number(p.old_price) > Number(p.price);

            return matchesSearch && matchesCategory && matchesBrand && matchesGender && matchesSize && matchesPromo;
        });

        filtered.sort((a,b) => {
            if (sort === "low") return Number(a.price) - Number(b.price);
            if (sort === "high") return Number(b.price) - Number(a.price);
            if (sort === "name") return String(a.name).localeCompare(String(b.name));
            return Number(b.id) - Number(a.id);
        });

        document.querySelectorAll(".product-card").forEach(card => {
            card.style.display = filtered.some(p => String(p.id) === card.dataset.id) ? "" : "none";
        });

        if (resultCount) resultCount.textContent = t("productCount", {count: filtered.length, plural: filtered.length > 1 ? "s" : ""});
        if (emptyState) emptyState.style.display = filtered.length ? "none" : "block";
    }

    // Search
    document.getElementById("searchToggle")?.addEventListener("click", () => {
        searchInput?.focus();
        if (searchInput?.value) document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    });
    document.getElementById("clearSearch")?.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        renderProducts();
    });
    searchInput?.addEventListener("input", renderProducts);

    // Filters
    document.querySelectorAll('input[name="category"], .brand-filter, .gender-filter, .size-filter').forEach(input => {
        input.addEventListener("change", renderProducts);
        input.addEventListener("input", renderProducts);
    });
    document.querySelectorAll(".brand-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const checkbox = [...document.querySelectorAll(".brand-filter")].find(input => input.value === chip.dataset.brandFilter);
            if (!checkbox) return;
            checkbox.checked = !checkbox.checked;
            renderProducts();
            document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
        });
    });
    sortSelect?.addEventListener("change", renderProducts);
    document.getElementById("filterToggle")?.addEventListener("click", () => {
        document.getElementById("filters")?.classList.toggle("open");
    });

    document.querySelectorAll(".store-nav a").forEach(link => {
        link.addEventListener("click", () => {
            const cat = link.dataset.categoryFilter;
            if (cat) {
                document.querySelectorAll('input[name="category"]').forEach(input => {
                    input.checked = input.value === cat;
                });
                promoOnly = false;
            } else if (link.dataset.sortFilter) {
                if (sortSelect) sortSelect.value = link.dataset.sortFilter;
                promoOnly = false;
                document.querySelectorAll('input[name="category"]').forEach(input => {
                    input.checked = input.value === "all";
                });
                document.querySelectorAll(".brand-filter").forEach(input => {
                    input.checked = false;
                });
                if (searchInput) searchInput.value = "";
                const sizeFilter = document.getElementById("sizeFilter");
                if (sizeFilter) sizeFilter.value = "";
            } else if (link.dataset.promoFilter) {
                promoOnly = !promoOnly;
            }
            renderProducts();
        });
    });

    // Sidebar navigation
    const sidebar = document.getElementById("siteSidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    function closeSidebar() {
        sidebar?.classList.remove("open");
        sidebarOverlay?.classList.remove("open");
        sidebar?.setAttribute("aria-hidden", "true");
        document.getElementById("menuButton")?.setAttribute("aria-expanded", "false");
    }
    document.getElementById("menuButton")?.addEventListener("click", () => {
        const open = sidebar?.classList.toggle("open") || false;
        sidebarOverlay?.classList.toggle("open", open);
        sidebar?.setAttribute("aria-hidden", String(!open));
        document.getElementById("menuButton")?.setAttribute("aria-expanded", String(open));
    });
    document.getElementById("sidebarClose")?.addEventListener("click", closeSidebar);
    sidebarOverlay?.addEventListener("click", closeSidebar);
    document.querySelectorAll(".sidebar-links a").forEach(link => link.addEventListener("click", () => {
        const cat = link.dataset.categoryFilter;
        if (cat) {
            document.querySelectorAll('input[name="category"]').forEach(input => {
                input.checked = input.value === cat;
            });
            renderProducts();
        }
        closeSidebar();
    }));

    // Favorites
    document.querySelectorAll(".heart").forEach(btn => {
        const id = Number(btn.dataset.id);
        if (favorites.includes(id)) btn.classList.add("active");
        btn.addEventListener("click", e => {
            e.stopPropagation();
            if (favorites.includes(id)) {
                favorites = favorites.filter(x => x !== id);
                btn.classList.remove("active");
            } else {
                favorites.push(id);
                btn.classList.add("active");
            }
            save();
        });
    });

    // Cart management
    function addToCart(id, size) {
        const product = products.find(p => String(p.id) === String(id));
        if (!product) return;
        const availableStock = Number((product.sizes || []).find(item => String(item.size) === String(size))?.stock || 0);
        if (availableStock < 1) return;

        const existing = cart.find(item => String(item.id) === String(id) && String(item.size) === String(size));
        if (existing) {
            if (existing.qty < availableStock) existing.qty++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image,
                size: String(size),
                qty: 1
            });
        }
        save();
        renderCart();
        openCart();
    }

    function changeQty(index, delta) {
        if (!cart[index]) return;
        const item = cart[index];
        const product = products.find(p => String(p.id) === String(item.id));
        const availableStock = Number((product?.sizes || []).find(s => String(s.size) === String(item.size))?.stock || 99);
        const nextQty = item.qty + delta;
        if (nextQty > availableStock) return;
        if (nextQty <= 0) {
            cart.splice(index, 1);
        } else {
            item.qty = nextQty;
        }
        save();
        renderCart();
        updateCheckoutSummary();
    }

    function removeCart(index) {
        cart.splice(index, 1);
        save();
        renderCart();
        updateCheckoutSummary();
    }

    function renderCart() {
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const cartCount = document.getElementById("cartCount");
        const drawerCount = document.getElementById("drawerCount");
        const cartItems = document.getElementById("cartItems");
        const cartEmpty = document.getElementById("cartEmpty");
        const cartFooter = document.getElementById("cartFooter");
        const cartTotal = document.getElementById("cartTotal");

        if (cartCount) cartCount.textContent = count;
        if (drawerCount) drawerCount.textContent = count;
        if (cartTotal) cartTotal.textContent = money(total);

        if (!cartItems || !cartEmpty || !cartFooter) return;

        if (cart.length === 0) {
            cartItems.innerHTML = "";
            cartEmpty.style.display = "block";
            cartFooter.style.display = "none";
            return;
        }

        cartEmpty.style.display = "none";
        cartFooter.style.display = "block";
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
                <div class="cart-item-info">
                    <h4>${escapeHtml(item.name)}</h4>
                    <p>${t("itemSize")} : <b>${escapeHtml(item.size)}</b></p>
                    <div class="qty-control">
                        <button data-cart-action="minus" data-index="${index}">−</button>
                        <span>${item.qty}</span>
                        <button data-cart-action="plus" data-index="${index}">+</button>
                        <button class="remove" data-cart-action="remove" data-index="${index}">${t("remove")}</button>
                    </div>
                </div>
                <strong>${money(item.price * item.qty)}</strong>
            </div>
        `).join("");
    }

    function updateCheckoutSummary() {
        const form = document.getElementById("checkoutForm");
        if (!form) return;
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const wilaya = form.elements.wilaya?.value.trim() || "";
        const commune = form.elements.commune?.value.trim() || "";
        const destinationReady = Boolean(wilaya && commune);
        const subEl = document.getElementById("checkoutSubtotal");
        const destEl = document.getElementById("checkoutDestination");
        const feeEl = document.getElementById("checkoutDeliveryFee");
        const totEl = document.getElementById("checkoutTotal");

        if (subEl) subEl.textContent = money(subtotal);
        if (destEl) destEl.textContent = destinationReady ? `${commune}, ${wilaya}` : t("enterDestination");
        if (feeEl) feeEl.textContent = destinationReady ? money(300) : "—";
        if (totEl) totEl.textContent = destinationReady ? money(subtotal + 300) : "—";
    }

    document.querySelector('#checkoutForm [name="wilaya"]')?.addEventListener("change", updateCheckoutSummary);
    document.querySelector('#checkoutForm [name="commune"]')?.addEventListener("input", updateCheckoutSummary);

    document.getElementById("cartItems")?.addEventListener("click", e => {
        const button = e.target.closest("[data-cart-action]");
        if (!button) return;
        const index = Number(button.dataset.index);
        const action = button.dataset.cartAction;
        if (action === "minus") changeQty(index, -1);
        if (action === "plus") changeQty(index, 1);
        if (action === "remove") removeCart(index);
    });

    function openCart() {
        document.getElementById("cartDrawer")?.classList.add("open");
        document.getElementById("overlay")?.classList.add("open");
    }
    function closeCart() {
        document.getElementById("cartDrawer")?.classList.remove("open");
        document.getElementById("overlay")?.classList.remove("open");
    }

    document.getElementById("cartButton")?.addEventListener("click", openCart);
    document.getElementById("closeCart")?.addEventListener("click", closeCart);
    document.getElementById("overlay")?.addEventListener("click", closeCart);
    document.getElementById("continueShopping")?.addEventListener("click", closeCart);

    document.querySelectorAll(".add-btn").forEach(btn => {
        btn.addEventListener("click", () => openProductModal(btn.dataset.productId));
    });

    // Product modal
    let selectedModalProduct = null;
    let selectedSize = "";

    function openProductModal(id) {
        const product = products.find(p => String(p.id) === String(id));
        if (!product) return;

        selectedModalProduct = product;
        const gallery = product.images?.length ? product.images : [product.image];
        const inStockSizes = (product.sizes || []).filter(item => Number(item.stock) > 0);
        selectedSize = "";

        const modalImage = document.getElementById("modalImage");
        const modalGallery = document.getElementById("modalGallery");
        const modalBrand = document.getElementById("modalBrand");
        const modalName = document.getElementById("modalName");
        const modalDesc = document.getElementById("modalDescription");
        const modalPrice = document.getElementById("modalPrice");
        const modalAvail = document.getElementById("modalAvailability");
        const sizesSelect = document.getElementById("sizes");
        const modalAdd = document.getElementById("modalAdd");

        if (modalImage) {
            modalImage.src = gallery[0] || product.image;
            modalImage.alt = product.name;
        }
        if (modalGallery) {
            modalGallery.innerHTML = gallery.map((image, index) => `
                <button class="gallery-thumb${index === 0 ? " selected" : ""}" type="button" data-image="${escapeHtml(image)}" aria-label="${t("photoLabel", {count: index + 1})}">
                    <img src="${escapeHtml(image)}" alt="">
                </button>
            `).join("");
        }
        if (modalBrand) modalBrand.textContent = product.brand;
        if (modalName) modalName.textContent = product.name;
        if (modalDesc) modalDesc.textContent = localizedDescription(product.description);
        if (modalPrice) modalPrice.textContent = money(product.price);
        if (modalAvail) {
            modalAvail.textContent = inStockSizes.length
                ? t("stockCount", {count: inStockSizes.reduce((total, s) => total + Number(s.stock), 0)})
                : t("stockOut");
        }
        if (sizesSelect) {
            sizesSelect.innerHTML = `
                <option value="">${t("chooseSize")}</option>
                ${(product.sizes || []).map(item => `
                    <option value="${escapeHtml(item.size)}" ${Number(item.stock) < 1 ? "disabled" : ""}>${escapeHtml(item.size)}</option>
                `).join("")}
            `;
        }
        if (modalAdd) modalAdd.disabled = true;

        document.getElementById("productModal")?.classList.add("open");
    }

    document.getElementById("modalGallery")?.addEventListener("click", event => {
        const thumb = event.target.closest(".gallery-thumb");
        if (!thumb) return;
        const modalImage = document.getElementById("modalImage");
        if (modalImage) modalImage.src = thumb.dataset.image;
        document.querySelectorAll(".gallery-thumb").forEach(item => item.classList.toggle("selected", item === thumb));
    });

    document.querySelectorAll(".quick-view, .product-image").forEach(el => {
        el.addEventListener("click", e => {
            if (e.target.closest(".quick-view") || e.currentTarget.classList.contains("product-image")) {
                openProductModal(el.dataset.productId || el.closest(".product-image")?.dataset.productId);
            }
        });
    });

    document.getElementById("sizes")?.addEventListener("change", event => {
        selectedSize = event.currentTarget.value;
        const modalAdd = document.getElementById("modalAdd");
        if (modalAdd) modalAdd.disabled = !selectedSize;
    });

    document.getElementById("modalAdd")?.addEventListener("click", () => {
        if (selectedModalProduct && selectedSize) {
            addToCart(selectedModalProduct.id, selectedSize);
            document.getElementById("productModal")?.classList.remove("open");
        }
    });

    document.getElementById("modalClose")?.addEventListener("click", () => {
        document.getElementById("productModal")?.classList.remove("open");
    });

    document.getElementById("productModal")?.addEventListener("click", e => {
        if (e.target.id === "productModal") e.currentTarget.classList.remove("open");
    });

    document.getElementById("checkoutBtn")?.addEventListener("click", () => {
        if (!cart.length) return;
        if (!window.AUTHENTICATED) {
            window.location.href = "auth.php?next=checkout";
            return;
        }
        updateCheckoutSummary();
        document.getElementById("checkoutModal")?.classList.add("open");
        closeCart();
    });

    document.getElementById("checkoutClose")?.addEventListener("click", () => {
        document.getElementById("checkoutModal")?.classList.remove("open");
    });

    document.getElementById("checkoutForm")?.addEventListener("submit", async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const submit = form.querySelector("[type=submit]");
        const feedback = document.getElementById("checkoutFeedback");
        const payload = new FormData(form);
        payload.set("action", "place_order");
        payload.set("items", JSON.stringify(cart.map(({id, size, qty}) => ({id, size, qty}))));
        if (submit) submit.disabled = true;
        if (feedback) feedback.textContent = t("sending");
        try {
            const response = await fetch("index.php", {method: "POST", body: payload});
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || t("orderFailure"));
            cart = [];
            save();
            renderCart();
            form.reset();
            if (feedback) {
                feedback.textContent = t("orderSuccess", {
                    number: result.order_number,
                    destination: `${result.commune}, ${result.wilaya}`,
                    fee: money(result.delivery_fee),
                    total: money(result.total)
                });
            }
        } catch (error) {
            if (feedback) feedback.textContent = localizedOrderError(error.message);
        } finally {
            if (submit) submit.disabled = false;
        }
    });

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function localizedOrderError(message) {
        if (language === "fr") return message || t("networkError");
        if (message?.startsWith("Stock insuffisant")) return t("stockError");
        const errors = {
            "La boutique est temporairement indisponible.": "unavailable",
            "Session expirée. Recharge la page.": "networkError",
            "Connecte-toi à ton compte client pour commander.": "loginRequired",
            "Vérifie le nom, le téléphone, la wilaya, la commune et le panier.": "fieldsError",
            "Le stock vient de changer. Vérifie ton panier.": "changedStock",
            "Un article du panier est invalide.": "itemInvalid",
            "Erreur serveur. Réessaie plus tard.": "networkError"
        };
        return t(errors[message] || "networkError");
    }

    applyLanguage();
    renderProducts();
    renderCart();
    if (!isInstalledApp && installNotice) {
        window.setTimeout(() => {
            if (!localStorage.getItem("chemsouInstalled") && !localStorage.getItem("musLockerInstalled")) {
                installNotice.hidden = false;
            }
        }, 700);
    }
    if (new URLSearchParams(window.location.search).get("checkout") === "1" && cart.length && window.AUTHENTICATED) {
        document.getElementById("checkoutModal")?.classList.add("open");
    }
});
