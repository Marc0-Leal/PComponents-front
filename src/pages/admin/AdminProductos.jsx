import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import CategoriassService from "../../services/CategoriassService";
import ProductsData from "../../data/Products";
import "../../styles/pages/Admin.css";
import AdminTable from "../../components/organisms/AdminTable";
import AdminModal from "../../components/organisms/AdminModal";
import ProductoForm from "../../components/molecules/ProductoForm";

export default function AdminProductos() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [relacionesCategorias, setRelacionesCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // producto que se edita o null

  useEffect(() => {
    if (!usuario || !usuario.rol || usuario.rol.id !== 2) {
      navigate("/");
    }
  }, [usuario, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      let prod = [];
      let cats = [];
      let rels = [];

      try {
        const res = await Promise.all([
          ProductoService.getAll(),
          CategoriaService.getAll(),
          CategoriassService.getAll(),
        ]);
        prod = res[0] || [];
        cats = res[1] || [];
        rels = res[2] || [];
      } catch (err) {
        prod = (ProductsData || []).map((p) => ({
          id: p.id,
          nombre: p.name || p.nombre,
          precio: p.price || p.precio,
          imagenUrl: p.image || p.imagenUrl,
          descripcion: p.description || p.descripcion || '',
          stock: p.stock ?? null,
          disponible: p.disponible ?? true,
        }));
        cats = [];
        rels = [];

        try {
          const overridesRaw = localStorage.getItem('productos_admin');
          if (overridesRaw) {
            const overrides = JSON.parse(overridesRaw);
            prod = prod.map((p) => {
              const o = overrides.find((x) => x.id === p.id);
              return o ? { ...p, ...o } : p;
            });
          }
        } catch (e) {}
      }

      setProductos(prod || []);
      setCategorias(cats || []);
      setRelacionesCategorias(rels || []);
    } catch (error) {
      alert("Error al cargar productos / categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getRelacionPorProductoId = (productoId) =>
    relacionesCategorias.find(
      (r) => r.producto && r.producto.id === productoId
    ) || null;

  const getCategoriaNombre = (producto) => {
    const rel = getRelacionPorProductoId(producto.id);
    return rel?.categoria?.nombre || "Sin asignar";
  };

  const getCategoriaIdDeProducto = (productoId) => {
    const rel = getRelacionPorProductoId(productoId);
    return rel?.categoria?.id ?? "";
  };

  const actualizarRelacionCategoria = async (productoId, nuevaCategoriaId) => {
    const relActual = getRelacionPorProductoId(productoId);

    if (!nuevaCategoriaId) {
      if (relActual) {
        await CategoriassService.delete(relActual.id);
      }
      return;
    }

    const catIdNum = Number(nuevaCategoriaId);

    if (relActual) {
      if (relActual.categoria?.id !== catIdNum) {
        await CategoriassService.delete(relActual.id);
        await CategoriassService.create({
          productoId,
          categoriaId: catIdNum,
        });
      }
    } else {
      await CategoriassService.create({
        productoId,
        categoriaId: catIdNum,
      });
    }
  };

  const openCreate = () => {
    setEditing(null); // creación
    setShowModal(true);
  };

  const openEdit = (p) => {
    const categoriaId = getCategoriaIdDeProducto(p.id);
    setEditing({
      ...p,
      categoriaId: categoriaId === "" ? "" : categoriaId,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleSubmit = async (values) => {
    const {
      nombre,
      precio,
      imagenUrl,
      descripcion,
      stock,
      categoriaId,
    } = values;

    const body = {
      nombre,
      precio: Number(precio),
      imagenUrl,
      descripcion,
      stock:
        stock === "" || stock === null || stock === undefined
          ? null
          : Number(stock),
    };

    try {
      if (editing) {
        await ProductoService.update(editing.id, body);
        await actualizarRelacionCategoria(editing.id, categoriaId);
        alert("Producto actualizado.");
      } else {
        const nuevo = await ProductoService.create(body);
        if (categoriaId) {
          await CategoriassService.create({
            productoId: nuevo.id,
            categoriaId: Number(categoriaId),
          });
        }
        alert("Producto creado.");
      }

      closeModal();
      await loadData();
    } catch (error) {
      alert("Error al guardar producto.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      try {
        await ProductoService.delete(id);
      } catch (err) {
        const overridesRaw = localStorage.getItem('productos_admin');
        const overrides = overridesRaw ? JSON.parse(overridesRaw) : [];
        // marcar como no disponible y stock 0
        const producto = productos.find((p) => p.id === id);
        if (producto) {
          const updated = { ...producto, stock: 0, disponible: false };
          const others = overrides.filter((o) => o.id !== id);
          others.push(updated);
          localStorage.setItem('productos_admin', JSON.stringify(others));
        }
      }

      const rel = getRelacionPorProductoId(id);
      if (rel) {
        try {
          await CategoriassService.delete(rel.id);
        } catch (e) {}
      }
      alert("Producto eliminado (o marcado como fuera de stock).");
      loadData();
    } catch (error) {
      alert("Error al eliminar producto.");
    }
  };

  const persistLocalOverride = (updatedProduct) => {
    try {
      const raw = localStorage.getItem('productos_admin');
      const arr = raw ? JSON.parse(raw) : [];
      const others = arr.filter((p) => p.id !== updatedProduct.id);
      others.push(updatedProduct);
      localStorage.setItem('productos_admin', JSON.stringify(others));
    } catch (e) {}
  };

  const handleToggleDisponible = async (producto) => {
    const nuevo = { ...producto, disponible: !producto.disponible };
    try {
      if (ProductoService && ProductoService.update) {
        await ProductoService.update(producto.id, { disponible: nuevo.disponible });
      } else {
        persistLocalOverride(nuevo);
      }
      loadData();
    } catch (e) {
      alert('No se pudo cambiar disponibilidad.');
    }
  };

  const handleSacarDeStock = async (producto) => {
    const nuevo = { ...producto, stock: 0, disponible: false };
    try {
      if (ProductoService && ProductoService.update) {
        await ProductoService.update(producto.id, { stock: 0, disponible: false });
      } else {
        persistLocalOverride(nuevo);
      }
      loadData();
    } catch (e) {
      alert('No se pudo sacar de stock.');
    }
  };

  const handleCambiarPrecio = async (producto) => {
    const input = window.prompt('Ingrese el nuevo precio (sin puntos ni comas):', String(producto.precio || producto.price || ''));
    if (input === null) return; // cancel
    const nuevoPrecio = Number(input.replace(/[^0-9.-]+/g, ''));
    if (Number.isNaN(nuevoPrecio)) {
      alert('Precio inválido');
      return;
    }
    const nuevo = { ...producto, precio: nuevoPrecio };
    try {
      if (ProductoService && ProductoService.update) {
        await ProductoService.update(producto.id, { precio: nuevoPrecio });
      } else {
        persistLocalOverride(nuevo);
      }
      alert('Precio actualizado.');
      loadData();
    } catch (e) {
      alert('No se pudo cambiar el precio.');
    }
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "nombre", header: "Nombre" },
    {
      key: "precio",
      header: "Precio",
      render: (row) => `$${Number(row.precio).toLocaleString("es-CL")}`,
    },
    {
      key: "stock",
      header: "Stock",
      render: (row) => row.stock ?? "-",
    },
    {
      key: "disponible",
      header: "Disponible",
      render: (row) => (row.disponible === false ? "No" : "Sí"),
    },
    {
      key: "categoria",
      header: "Categoría",
      render: (row) => getCategoriaNombre(row),
    },
    {
      key: "imagenUrl",
      header: "Imagen",
      render: (row) =>
        row.imagenUrl ? (
          <img
            src={row.imagenUrl}
            alt={row.nombre}
            style={{ width: 40, height: 40, objectFit: "cover" }}
          />
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Gestión de productos</h1>
        <button onClick={openCreate}>Crear producto</button>
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <AdminTable
          columns={columns}
          data={productos}
          renderActions={(row) => (
            <>
              <button onClick={() => openEdit(row)}>Editar</button>
              <button onClick={() => handleDelete(row.id)}>Eliminar</button>
              <button onClick={() => handleCambiarPrecio(row)}>Cambiar precio</button>
              <button onClick={() => handleSacarDeStock(row)}>Sacar de stock</button>
              <button onClick={() => handleToggleDisponible(row)}>
                {row.disponible === false ? 'Marcar disponible' : 'Marcar no disponible'}
              </button>
            </>
          )}
        />
      )}

      {showModal && (
        <AdminModal
          title={editing ? "Editar producto" : "Crear producto"}
          onClose={closeModal}
        >
          <ProductoForm
            initialData={editing}
            categorias={categorias}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </AdminModal>
      )}
    </div>
  );
}
