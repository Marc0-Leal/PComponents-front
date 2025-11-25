import ProductsData from '../data/Products';

function normalize(product) {
  // normalize fields from various sources
  return {
    id: Number(product.id),
    name: product.name || product.nombre || '',
    description: product.description || product.descripcion || '',
    price: Number(product.price ?? product.precio ?? 0),
    image: product.image || product.imagenUrl || null,
    stock: product.stock ?? null,
    disponible: product.disponible === undefined ? true : !!product.disponible,
  };
}

export function getMergedProducts() {
  const base = (ProductsData || []).map((p) => normalize(p));

  try {
    const raw = localStorage.getItem('productos_admin');
    if (!raw) return base;
    const overrides = JSON.parse(raw);
    return base.map((b) => {
      const o = (overrides || []).find((x) => Number(x.id) === Number(b.id));
      if (!o) return b;
      // merge override fields
      const merged = {
        ...b,
        name: o.nombre || o.name || b.name,
        description: o.descripcion || o.description || b.description,
        price: Number(o.precio ?? o.price ?? b.price),
        image: o.imagenUrl || o.image || b.image,
        stock: o.stock ?? b.stock,
        disponible: o.disponible === undefined ? b.disponible : !!o.disponible,
      };
      return normalize(merged);
    });
  } catch (e) {
    return base;
  }
}

export function getProductById(id) {
  const all = getMergedProducts();
  return all.find((p) => Number(p.id) === Number(id));
}

export default { getMergedProducts, getProductById };
