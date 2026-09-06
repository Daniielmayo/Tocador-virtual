import React, { useState, useRef } from 'react';
import { useVanity } from '../context/VanityContext';
import { PRESET_SHADE_COLORS } from '../data/initialData';

export const AddProductView: React.FC = () => {
  const {
    brands,
    addProduct,
    updateProduct,
    editingProduct,
    setEditingProduct,
    setCurrentTab,
    addBrand,
    addCategory,
    categories,
    showToast,
    uploadImage,
  } = useVanity();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Image states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [selectedBrand, setSelectedBrand] = useState<string>(
    editingProduct?.brandName || (brands[0]?.name || 'Rare Beauty')
  );
  const [productName, setProductName] = useState<string>(
    editingProduct?.name || ''
  );
  const [reference, setReference] = useState<string>(
    editingProduct?.reference || `#REF${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [category, setCategory] = useState<string>(
    editingProduct?.category || 'rubor'
  );
  const [shadeName, setShadeName] = useState<string>(
    editingProduct?.shadeName || ''
  );
  const [shadeColor, setShadeColor] = useState<string>(
    editingProduct?.shadeColor || ''
  );
  const [imageUrl, setImageUrl] = useState<string>(
    editingProduct?.imageUrl ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9uRXvdw7dEvDzVv60CSWQ8iSCooAMXrz1qFJm_iqWwC_cfVNnidAJobkiKxRofSg7Tu6GwGtzKpHZXToFUJikvIJ-_bX3JjHBvpyqO8azYZuBM-ilvVhwfkaLUgQVuK9S2wocHZCLq48xVqnPiCXb5lot7-pXtvpoOUl4uAlbVFjNkRDRejI8eiuYlbIYlaYMKb9esemzlSlRerFeYES55JlNFEo0jqESR2yK6gUNVxxezZike34WmA'
  );
  const [purchasePrice, setPurchasePrice] = useState<string>(
    editingProduct?.purchasePrice || ''
  );
  const [store, setStore] = useState<string>(
    editingProduct?.store || ''
  );
  const [purchaseDate, setPurchaseDate] = useState<string>(
    editingProduct?.purchaseDate || new Date().toISOString().split('T')[0]
  );

  // Inline creation states
  const [showAddBrandInput, setShowAddBrandInput] = useState(false);
  const [newBrandInput, setNewBrandInput] = useState('');
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [shadeEnabled, setShadeEnabled] = useState(
    editingProduct ? !!(editingProduct.shadeName || editingProduct.shadeColor) : true
  );

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file); // Store file to upload later

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string); // Preview immediately
        showToast('Imagen seleccionada. Se subirá al guardar.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Add new Brand dynamically
  const handleCreateBrand = async () => {
    if (!newBrandInput.trim()) return;
    const brandNameCreated = newBrandInput.trim();
    const created = await addBrand({ name: brandNameCreated });
    setSelectedBrand(created.name);
    setNewBrandInput('');
    setShowAddBrandInput(false);
  };

  // Add new Category dynamically (saved to Firebase via context)
  const handleCreateCategory = () => {
    if (!newCategoryInput.trim()) return;
    const catLower = newCategoryInput.trim().toLowerCase();
    addCategory(catLower);
    setCategory(catLower);
    setNewCategoryInput('');
    setShowAddCategoryInput(false);
  };

  // Save product
  const handleSave = async () => {
    if (!productName.trim()) {
      showToast('Por favor introduce el nombre del producto');
      return;
    }

    setIsSaving(true);
    let finalImageUrl = imageUrl;

    try {
      // Upload to Firebase Storage if a new file was selected
      if (selectedFile) {
        showToast('Subiendo imagen...');
        const uploadedUrl = await uploadImage(selectedFile, 'products');
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          // If upload fails, keep the fallback/previous URL
          showToast('Falló la subida. Usando imagen anterior.');
        }
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: productName.trim(),
          brandName: selectedBrand,
          reference: reference.trim(),
          category,
          shadeName: shadeEnabled ? shadeName.trim() : '',
          shadeColor: shadeEnabled ? shadeColor.trim() : '',
          imageUrl: finalImageUrl,
          purchasePrice: purchasePrice.trim(),
          store: store.trim(),
          purchaseDate,
        });
        setEditingProduct(null);
      } else {
        await addProduct({
          name: productName.trim(),
          brandName: selectedBrand,
          reference: reference.trim(),
          category,
          subCategory: category.charAt(0).toUpperCase() + category.slice(1),
          shadeName: shadeEnabled ? shadeName.trim() : '',
          shadeColor: shadeEnabled ? shadeColor.trim() : '',
          imageUrl: finalImageUrl,
          purchasePrice: purchasePrice.trim(),
          store: store.trim(),
          purchaseDate,
          isFavorite: false,
        });
      }

      setCurrentTab('tocador');
    } catch (error: any) {
      console.error('Error saving product:', error);
      showToast('Ocurrió un error al guardar el producto');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 space-y-5">
      {/* Encabezado */}
      <div className="flex flex-col space-y-1">
        <h1 className="font-headline text-[30px] font-semibold text-[#261819] leading-tight">
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
        <p className="text-[13px] text-[#554246]">
          Ingresa los detalles principales de tu cosmético.
        </p>
      </div>

      {/* 1. Imagen del Producto */}
      <div className="p-4 rounded-3xl bg-white border border-[#dac0c5]/30 shadow-sm space-y-3 text-center">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#fff0f1] border border-[#dac0c5]/25 group">
          <img
            src={imageUrl}
            alt="Preview producto"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#261819]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-full bg-white text-[#261819] text-[12px] font-bold shadow-md"
            >
              Cambiar Imagen
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-11 rounded-2xl bg-[#fee1e4] hover:bg-[#f8dcde] text-[#261819] text-[13px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[#9c385b] text-[20px]">
              photo_camera
            </span>
            <span>Cámara</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-11 rounded-2xl bg-[#fee1e4] hover:bg-[#f8dcde] text-[#261819] text-[13px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[#9c385b] text-[20px]">
              photo_library
            </span>
            <span>Galería</span>
          </button>
        </div>
      </div>

      {/* 2. Marca & Crear Marca */}
      <div className="p-4 rounded-3xl bg-white border border-[#dac0c5]/30 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-bold text-[#261819]">Marca</label>
          <button
            type="button"
            onClick={() => setShowAddBrandInput(!showAddBrandInput)}
            className="text-[12px] font-bold text-[#9c385b] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Crear Marca</span>
          </button>
        </div>

        {/* Input para Crear Nueva Marca Inline */}
        {showAddBrandInput && (
          <div className="p-3 rounded-2xl bg-[#fee1e4]/50 border border-[#dac0c5]/40 flex items-center gap-2">
            <input
              value={newBrandInput}
              onChange={(e) => setNewBrandInput(e.target.value)}
              placeholder="Nombre de la nueva marca..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-white text-[13px] text-[#261819] border border-[#dac0c5]/40 outline-none"
            />
            <button
              type="button"
              onClick={handleCreateBrand}
              className="px-3.5 py-1.5 rounded-xl bg-[#9c385b] text-white text-[12px] font-bold active:scale-95"
            >
              Guardar
            </button>
          </div>
        )}

        {/* Chips de Selección de Marca */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {brands.map((b) => {
            const isSelected = selectedBrand.toLowerCase() === b.name.toLowerCase();
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBrand(b.name)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 flex-shrink-0 transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#8e4a53] text-white shadow-sm'
                    : 'bg-[#fee1e4]/50 text-[#554246] hover:bg-[#fee1e4]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
                <span>{b.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Nombre del Producto & Referencia */}
      <div className="p-4 rounded-3xl bg-white border border-[#dac0c5]/30 shadow-sm space-y-3">
        <label className="text-[13px] font-bold text-[#261819]">Nombre & Referencia</label>

        <div className="h-12 px-3.5 rounded-2xl bg-[#fff0f1] border border-[#dac0c5]/25 flex items-center">
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Nombre del producto (ej. Soft Pinch Blush)"
            className="w-full bg-transparent text-[14px] text-[#261819] font-medium outline-none placeholder:text-[#877176]/70"
          />
        </div>

        <div className="h-12 px-3.5 rounded-2xl bg-[#fff0f1] border border-[#dac0c5]/25 flex items-center">
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Referencia o Código (ej. #RB8921)"
            className="w-full bg-transparent text-[13px] text-[#554246] font-medium outline-none placeholder:text-[#877176]/70"
          />
        </div>
      </div>

      {/* 4. Categoría & Crear Categoría */}
      <div className="p-4 rounded-3xl bg-white border border-[#dac0c5]/30 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-bold text-[#261819]">Tipo / Categoría</label>
          <button
            type="button"
            onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
            className="text-[12px] font-bold text-[#9c385b] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Crear Categoría</span>
          </button>
        </div>

        {/* Input para Crear Categoría Inline */}
        {showAddCategoryInput && (
          <div className="p-3 rounded-2xl bg-[#fee1e4]/50 border border-[#dac0c5]/40 flex items-center gap-2">
            <input
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="Nombre de la nueva categoría..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-white text-[13px] text-[#261819] border border-[#dac0c5]/40 outline-none"
            />
            <button
              type="button"
              onClick={handleCreateCategory}
              className="px-3.5 py-1.5 rounded-xl bg-[#9c385b] text-white text-[12px] font-bold active:scale-95"
            >
              Guardar
            </button>
          </div>
        )}

        {/* Grid de Selección de Categoría */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = category.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 px-3.5 rounded-2xl text-[12px] font-bold capitalize transition-all active:scale-95 border ${
                  isSelected
                    ? 'bg-[#fee1e4] border-[#9c385b] text-[#9c385b] shadow-sm'
                    : 'bg-[#fff0f1] border-transparent text-[#554246] hover:bg-[#fee1e4]/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Tono / Número / Código & Selector Hexadecimal */}
      <div className="p-4 rounded-3xl bg-white border border-[#dac0c5]/30 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-bold text-[#261819]">
            Tono / Número / Color
          </label>
          {/* Switch Toggle */}
          <button
            type="button"
            onClick={() => setShadeEnabled(!shadeEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              shadeEnabled ? 'bg-[#9c385b]' : 'bg-[#dac0c5]'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                shadeEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {shadeEnabled && (
          <>
            {/* Color preview badge */}
            {shadeColor && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fff0f1] w-fit">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: shadeColor }}
                ></span>
                <span className="text-[11px] font-bold text-[#261819]">
                  {shadeColor}
                </span>
              </div>
            )}

            {/* Input para Tono o Número */}
            <div className="h-12 px-3.5 rounded-2xl bg-[#fff0f1] border border-[#dac0c5]/25 flex items-center">
              <input
                value={shadeName}
                onChange={(e) => setShadeName(e.target.value)}
                placeholder="Ej. #140, 01, Happy, Fair 3 (número o nombre)"
                className="w-full bg-transparent text-[14px] text-[#261819] font-medium outline-none"
              />
            </div>

            {/* Selección de Color Hexadecimal */}
            <div className="space-y-2 pt-1">
              <span className="text-[11.5px] text-[#554246] font-medium">
                Elige un color o ingresa su código Hexadecimal:
              </span>

              {/* Paleta de Colores Rápidos */}
              <div className="flex items-center justify-between gap-1 flex-wrap">
                {PRESET_SHADE_COLORS.map((preset) => {
                  const isSelected = shadeColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setShadeColor(preset.hex)}
                      title={preset.name}
                      className={`w-9 h-9 rounded-full transition-transform active:scale-90 border-2 ${
                        isSelected
                          ? 'border-[#9c385b] scale-110 shadow-md ring-2 ring-[#fda7b0]'
                          : 'border-white shadow-sm'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                    ></button>
                  );
                })}
              </div>

              {/* Selector HEX Manual + Color Picker Native */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-11 px-3 rounded-2xl bg-[#fff0f1] border border-[#dac0c5]/25 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#877176]">HEX</span>
                  <input
                    type="text"
                    value={shadeColor}
                    onChange={(e) => setShadeColor(e.target.value)}
                    placeholder="#E58C96"
                    className="w-full bg-transparent text-[12px] font-bold text-[#261819] outline-none"
                  />
                </div>

                <label className="h-11 px-3 rounded-2xl bg-[#fee1e4] hover:bg-[#f8dcde] text-[#261819] text-[12px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                  <span
                    className="w-4 h-4 rounded-md shadow-sm border border-white"
                    style={{ backgroundColor: shadeColor || '#E58C96' }}
                  ></span>
                  <span>Paleta de Color</span>
                  <span className="material-symbols-outlined text-[16px] text-[#9c385b]">
                    colorize
                  </span>
                  <input
                    type="color"
                    value={shadeColor.startsWith('#') ? shadeColor : '#E58C96'}
                    onChange={(e) => setShadeColor(e.target.value)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 6. Fecha de Compra */}
      <div className="p-4 rounded-3xl bg-white border border-[#dac0c5]/30 shadow-sm space-y-3">
        <label className="text-[13px] font-bold text-[#261819]">
          Fecha de Compra
        </label>
        <div className="h-12 px-3.5 rounded-2xl bg-[#fff0f1] border border-[#dac0c5]/25 flex items-center">
          <span className="material-symbols-outlined text-[18px] text-[#877176] mr-2">calendar_today</span>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full bg-transparent text-[14px] text-[#261819] font-medium outline-none"
          />
        </div>
      </div>

      {/* 7. Compra (Precio y Tienda) */}
      <div className="p-4 rounded-3xl bg-white border border-[#dac0c5]/30 shadow-sm space-y-3">
        <label className="text-[13px] font-bold text-[#261819]">
          Detalles de Compra (Opcional)
        </label>
        
        <div className="space-y-3">
          <div className="h-12 px-3.5 rounded-2xl bg-[#fff0f1] border border-[#dac0c5]/25 flex items-center">
            <span className="material-symbols-outlined text-[18px] text-[#877176] mr-2">sell</span>
            <input
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="Último precio de compra (Ej. $45.000)"
              className="w-full bg-transparent text-[14px] text-[#261819] font-medium outline-none"
            />
          </div>

          <div className="h-12 px-3.5 rounded-2xl bg-[#fff0f1] border border-[#dac0c5]/25 flex items-center">
            <span className="material-symbols-outlined text-[18px] text-[#877176] mr-2">store</span>
            <input
              value={store}
              onChange={(e) => setStore(e.target.value)}
              placeholder="¿Dónde lo compraste? (Ej. Sephora)"
              className="w-full bg-transparent text-[14px] text-[#261819] font-medium outline-none"
            />
          </div>
        </div>
      </div>

      {/* Botones Guardar / Cancelar */}
      <div className="pt-2 space-y-2.5 mb-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-13 rounded-2xl bg-[#8e4a53] hover:bg-[#793942] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all disabled:opacity-75 disabled:active:scale-100"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          )}
          <span>{isSaving ? 'Guardando...' : (editingProduct ? 'Actualizar Producto' : 'Guardar Producto')}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setCurrentTab('tocador');
          }}
          className="w-full h-11 text-center font-semibold text-[14px] text-[#554246] hover:text-[#261819] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
