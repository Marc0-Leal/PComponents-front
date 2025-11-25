import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PedidoService from "../../services/PedidoService";
import "../../styles/pages/Admin.css";
import AdminModal from "../../components/organisms/AdminModal";
import PedidoEstadoForm from "../../components/molecules/PedidoEstadoForm";

export default function AdminPedidos() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [filtroEmail, setFiltroEmail] = useState("");

  const [formData, setFormData] = useState({
    estadoId: 1,
    envioId: 1,
    pagoId: 2,
  });

  useEffect(() => {
    if (!usuario || !usuario.rol || usuario.rol.id !== 2) {
      navigate("/");
    }
  }, [usuario, navigate]);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const data = await PedidoService.getAll();
      setPedidos(data || []);
    } catch (error) {
      alert("Error al cargar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPedidos();
  }, []);

  const pedidosFiltrados = useMemo(() => {
    if (!filtroEmail) return pedidos;
    return pedidos.filter((p) =>
      p.usuario?.email?.toLowerCase().includes(filtroEmail.toLowerCase())
    );
  }, [pedidos, filtroEmail]);

  const openEdit = (p) => {
    setEditing(p);
    setFormData({
      estadoId: p.estado?.id ?? 1,
      envioId: p.envio?.id ?? 1,
      pagoId: p.pago?.id ?? 2,
    });
  };

  const closeModal = () => {
    setEditing(null);
    setFormData({
      estadoId: 1,
      envioId: 1,
      pagoId: 2,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) return;

    const {
      estadoId = 1,
      envioId = 1,
      pagoId = 2,
    } = formData || {};

    try {
      await PedidoService.updatePartial(editing.id, {
        estado: { id: Number(estadoId) },
        envio: { id: Number(envioId) },
        pago: { id: Number(pagoId) },
      });
      alert("Pedido actualizado.");
      closeModal();
      loadPedidos();
    } catch (error) {
      alert("Error al actualizar pedido.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    try {
      await PedidoService.delete(id);
      alert("Pedido eliminado.");
      loadPedidos();
    } catch (error) {
      alert("Error al eliminar pedido.");
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    try {
      return new Date(fecha).toLocaleString("es-CL");
    } catch {
      return fecha;
    }
  };

  return (
    <div className="admin-page">
      <h1>Gestión de pedidos</h1>

      <div className="admin-filtros">
        <label>
          Filtrar por email:
          <input
            type="text"
            value={filtroEmail}
            onChange={(e) => setFiltroEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </label>
      </div>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Fecha creación</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Envío</th>
              <th>Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.usuario?.nombreUsuario}</td>
                <td>{p.usuario?.email}</td>
                <td>{formatFecha(p.fechaCreacion)}</td>
                <td>${Number(p.total ?? 0).toLocaleString("es-CL")}</td>
                <td>{p.estado?.tipoEstado}</td>
                <td>{p.envio?.metodoEnvio}</td>
                <td>{p.pago?.tipoPago}</td>
                <td>
                  <button onClick={() => openEdit(p)}>Editar</button>
                  <button onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <AdminModal
          title={`Editar pedido #${editing.id}`}
          onClose={closeModal}
        >
          <PedidoEstadoForm
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </AdminModal>
      )}
    </div>
  );
}
