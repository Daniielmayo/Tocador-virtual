import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType, testFirestoreConnection } from '../firebase';
import { Brand, Product, VanityTab } from '../types';
import { INITIAL_BRANDS, INITIAL_PRODUCTS } from '../data/initialData';

const DEFAULT_EMAIL = 'yulitzahernandezherrera@gmail.com';
const DEFAULT_PASS = 'Yulisa123*';
const DEFAULT_NAME = 'Yulitza Hernández';

interface VanityContextType {
  user: User | null;
  isGuest: boolean;
  loadingAuth: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithDefaultUser: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Navigation & Views
  currentTab: VanityTab;
  setCurrentTab: (tab: VanityTab) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  selectedBrandId: string;
  setSelectedBrandId: (id: string) => void;
  
  // Modals
  isAddBrandModalOpen: boolean;
  setIsAddBrandModalOpen: (open: boolean) => void;
  isDailyRoutineOpen: boolean;
  setIsDailyRoutineOpen: (open: boolean) => void;

  // Data
  brands: Brand[];
  products: Product[];
  activeBrand: Brand | null;
  
  // CRUD
  addProduct: (newProd: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  addBrand: (newBrand: Partial<Brand>) => Promise<Brand>;
  updateBrand: (id: string, updates: Partial<Brand>) => Promise<void>;
  
  // Filters & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  brandFilter: string;
  setBrandFilter: (brand: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (favsOnly: boolean) => void;
  
  // Toast
  toast: { message: string; visible: boolean };
  showToast: (message: string) => void;
}

const VanityContext = createContext<VanityContextType | undefined>(undefined);

const LOCAL_STORAGE_PRODUCTS_KEY = 'vanity_products_v1';
const LOCAL_STORAGE_BRANDS_KEY = 'vanity_brands_v1';

export const VanityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  const [currentTab, setCurrentTab] = useState<VanityTab>('tocador');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('brand-rare-beauty');

  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [isDailyRoutineOpen, setIsDailyRoutineOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 2800);
  };

  // State collections
  const [brands, setBrands] = useState<Brand[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BRANDS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BRANDS;
    } catch {
      return INITIAL_BRANDS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Save to localStorage as fallback cache
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_BRANDS_KEY, JSON.stringify(brands));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [brands]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [products]);

  // Boot connection test
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  const LOCAL_STORAGE_USER_KEY = 'vanity_user_session_v1';

  // Load saved local user session if present on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.email) {
          setUser(parsed as User);
          setIsGuest(false);
        }
      }
    } catch {
      // Ignored
    }
  }, []);

  const syncFirestoreData = (userId: string) => {
    try {
      const qProducts = query(collection(db, 'products'), where('userId', '==', userId));
      const unsubscribeProducts = onSnapshot(
        qProducts,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedProducts: Product[] = snapshot.docs.map((doc) => doc.data() as Product);
            setProducts(fetchedProducts);
          }
        },
        (error) => {
          console.warn('Firestore products sync warning:', error);
        }
      );

      const qBrands = query(collection(db, 'brands'), where('userId', '==', userId));
      const unsubscribeBrands = onSnapshot(
        qBrands,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedBrands: Brand[] = snapshot.docs.map((doc) => doc.data() as Brand);
            setBrands(fetchedBrands);
          }
        },
        (error) => {
          console.warn('Firestore brands sync warning:', error);
        }
      );

      return () => {
        unsubscribeProducts();
        unsubscribeBrands();
      };
    } catch (e) {
      console.warn('Error setting up Firestore listener:', e);
    }
  };

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsGuest(false);
        setLoadingAuth(false);
        showToast(`Bienvenida, ${currentUser.displayName || DEFAULT_NAME}`);
        syncFirestoreData(currentUser.uid);
      } else {
        const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (!savedUser) {
          setUser(null);
          setIsGuest(true);
        }
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      // Try Firebase Auth Sign-In
      const res = await signInWithEmailAndPassword(auth, email, pass);
      setUser(res.user);
      setIsGuest(false);
      localStorage.setItem(
        LOCAL_STORAGE_USER_KEY,
        JSON.stringify({
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || DEFAULT_NAME,
        })
      );
      setCurrentTab('tocador');
      setSelectedProductId(null);
      showToast('Sesión iniciada con éxito');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Auto-registro SOLAMENTE para el correo por defecto
      if (email.toLowerCase() === DEFAULT_EMAIL.toLowerCase()) {
        try {
          const res = await createUserWithEmailAndPassword(auth, email, pass);
          if (res.user) {
            await updateProfile(res.user, {
              displayName: DEFAULT_NAME,
            });
          }
          setUser(res.user);
          setIsGuest(false);
          localStorage.setItem(
            LOCAL_STORAGE_USER_KEY,
            JSON.stringify({
              uid: res.user.uid,
              email: res.user.email,
              displayName: res.user.displayName || DEFAULT_NAME,
            })
          );
          setCurrentTab('tocador');
          setSelectedProductId(null);
          showToast('Sesión iniciada con éxito (Cuenta nueva)');
          return;
        } catch (createErr) {
          console.error('Error al crear la cuenta principal:', createErr);
        }
      }

      showToast('Error: Correo o contraseña incorrectos');
    }
  };

  const loginWithDefaultUser = async () => {
    await loginWithEmail(DEFAULT_EMAIL, DEFAULT_PASS);
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setCurrentTab('tocador');
      setSelectedProductId(null);
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      showToast('Error al iniciar sesión con Google');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignored
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setUser(null);
    setIsGuest(true);
    showToast('Has cerrado sesión');
  };

  const activeBrand = brands.find((b) => b.id === selectedBrandId) || brands[0] || null;

  // CRUD for Products
  const addProduct = async (newProdData: Partial<Product>): Promise<Product> => {
    const newId = `prod-${Date.now()}`;
    const targetUserId = user ? user.uid : 'default';

    const brandName = newProdData.brandName || 'Rare Beauty';
    const existingBrand = brands.find((b) => b.name.toLowerCase() === brandName.toLowerCase());
    const brandId = existingBrand ? existingBrand.id : 'brand-rare-beauty';

    const created: Product = {
      id: newId,
      userId: targetUserId,
      brandId: newProdData.brandId || brandId,
      brandName,
      name: newProdData.name || 'Nuevo Producto',
      category: newProdData.category || 'rubor',
      subCategory: newProdData.subCategory || 'Cosmético',
      shadeName: newProdData.shadeName || 'Tono Universal',
      shadeColor: newProdData.shadeColor || '#E26D82',
      shadeDescription: newProdData.shadeDescription || '',
      finish: newProdData.finish || 'Dewy',
      reference: newProdData.reference || `#REF${Math.floor(1000 + Math.random() * 9000)}`,
      imageUrl: newProdData.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9uRXvdw7dEvDzVv60CSWQ8iSCooAMXrz1qFJm_iqWwC_cfVNnidAJobkiKxRofSg7Tu6GwGtzKpHZXToFUJikvIJ-_bX3JjHBvpyqO8azYZuBM-ilvVhwfkaLUgQVuK9S2wocHZCLq48xVqnPiCXb5lot7-pXtvpoOUl4uAlbVFjNkRDRejI8eiuYlbIYlaYMKb9esemzlSlRerFeYES55JlNFEo0jqESR2yK6gUNVxxezZike34WmA',
      status: newProdData.status || 'en_uso',
      size: newProdData.size || '3.2 ml',
      isFavorite: !!newProdData.isFavorite,
      isViralFavorite: !!newProdData.isViralFavorite,
      paoMonths: newProdData.paoMonths || 12,
      purchaseDate: newProdData.purchaseDate || 'Hoy',
      openedDate: newProdData.openedDate || 'Hoy',
      location: newProdData.location || 'Cajón superior / Tocador',
      personalNotes: newProdData.personalNotes || '',
      purchasePrice: newProdData.purchasePrice || '',
      store: newProdData.store || '',
      otherShades: newProdData.otherShades || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts((prev) => [created, ...prev]);

    // Update brand productCount
    setBrands((prev) =>
      prev.map((b) => (b.id === created.brandId ? { ...b, productCount: b.productCount + 1 } : b))
    );

    // Save to Firestore if signed in
    if (user) {
      try {
        await setDoc(doc(db, 'products', created.id), created);
        // Also update brand doc
        const brandRef = doc(db, 'brands', created.brandId);
        await updateDoc(brandRef, { productCount: (existingBrand?.productCount || 0) + 1 });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `products/${created.id}`);
      }
    }

    showToast(`¡${created.name} añadido a tu tocador! ✨`);
    return created;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );

    if (user) {
      try {
        await updateDoc(doc(db, 'products', id), {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
      }
    }

    showToast('Producto actualizado con elegancia');
  };

  const deleteProduct = async (id: string) => {
    const toDelete = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (toDelete) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === toDelete.brandId ? { ...b, productCount: Math.max(0, b.productCount - 1) } : b
        )
      );
    }

    if (selectedProductId === id) {
      setSelectedProductId(null);
    }

    if (user) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
      }
    }

    showToast('Producto eliminado de tu tocador');
  };

  const toggleFavorite = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;

    const newFav = !target.isFavorite;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: newFav } : p))
    );

    showToast(newFav ? 'Añadido a tus favoritos del tocador ♥' : 'Eliminado de tus favoritos');

    if (user) {
      try {
        await updateDoc(doc(db, 'products', id), { isFavorite: newFav });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
      }
    }
  };

  // CRUD for Brands
  const addBrand = async (newBrandData: Partial<Brand>): Promise<Brand> => {
    const newId = `brand-${Date.now()}`;
    const targetUserId = user ? user.uid : 'default';

    const created: Brand = {
      id: newId,
      userId: targetUserId,
      name: newBrandData.name || 'Nueva Marca',
      creator: newBrandData.creator || 'Fundador(a)',
      quote: newBrandData.quote || 'Cosmética exclusiva pensada para sublimar la belleza natural.',
      logoUrl: newBrandData.logoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9_lgi2LjyXi-ymSiO1MSgSbCeYPp8NRdiZFGJW6ImP0YlVz14vOBFkcEx8ug-JTyMQBOOHfOLe2jKEA32APvoKr_dlhI363n9PNrgAIVVd6x1e9s5ukhPp6su5j8Uazxifevdj9K55weMhh6aBUDIB0kALTcivKxeUIEcJ3RVyalF164to9_TIW0rWUQDwxBQ-iJjDr25d1ZsUZJ870932ICEgGA290NVulndEks_-JO765p8eli7Cg',
      bannerUrl: newBrandData.bannerUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCExTy1_pWmgqvksHvIB-h-fRdZgELHk4IDRN6aI50NNODA0f2SU9lWh4O2vdDur1iHRLClrIeGOxoNXtKpxwsdZkrIxc9hTBHlgGncmPhi0d-osUj9_NdkVpH4c8r26QrGUUgKFmMK4oVAMhIDEfJsb9KcNK5z4U0hxcA4j19Wx0eQI-UJSOLJKs5r_CldNxukdMsKAO0NVDekI8JeSfj5jOGUYPLTZd2Zc7dNJi2Zqsjf05wMP5Ty2g',
      specialty: newBrandData.specialty || 'Color & Swatches',
      isActiveCollection: false,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBrands((prev) => [...prev, created]);
    setSelectedBrandId(created.id);

    if (user) {
      try {
        await setDoc(doc(db, 'brands', created.id), created);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `brands/${created.id}`);
      }
    }

    showToast(`¡${created.name} registrada en tu tocador!`);
    return created;
  };

  const updateBrand = async (id: string, updates: Partial<Brand>) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b))
    );

    if (user) {
      try {
        await updateDoc(doc(db, 'brands', id), {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `brands/${id}`);
      }
    }

    showToast('Marca actualizada con éxito');
  };

  return (
    <VanityContext.Provider
      value={{
        user,
        isGuest,
        loadingAuth,
        loginWithGoogle,
        loginWithEmail,
        loginWithDefaultUser,
        logout,
        currentTab,
        setCurrentTab,
        selectedProductId,
        setSelectedProductId,
        editingProduct,
        setEditingProduct,
        selectedBrandId,
        setSelectedBrandId,
        isAddBrandModalOpen,
        setIsAddBrandModalOpen,
        isDailyRoutineOpen,
        setIsDailyRoutineOpen,
        brands,
        products,
        activeBrand,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFavorite,
        addBrand,
        updateBrand,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        brandFilter,
        setBrandFilter,
        statusFilter,
        setStatusFilter,
        favoritesOnly,
        setFavoritesOnly,
        toast,
        showToast,
      }}
    >
      {children}
    </VanityContext.Provider>
  );
};

export const useVanity = () => {
  const context = useContext(VanityContext);
  if (!context) {
    throw new Error('useVanity must be used within a VanityProvider');
  }
  return context;
};
