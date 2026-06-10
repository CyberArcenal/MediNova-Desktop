// src/renderer/pages/treatments/list/hooks/useTreatments.ts
import { useState, useEffect, useCallback } from "react";
import treatmentsAPI, {
  type TreatmentResponseDto,
} from "../../../../api/core/treatments";
import { useModal } from "../../../../hooks/useModal";
import { dialogs } from "../../../../utils/dialogs";
import { useNavigate } from "react-router-dom";

export const useTreatments = () => {
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<TreatmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedTreatment, setSelectedTreatment] =
    useState<TreatmentResponseDto | null>(null);
  const viewModal = useModal();
  const formModal = useModal();
  const [editingTreatment, setEditingTreatment] =
    useState<TreatmentResponseDto | null>(null);

  const fetchTreatments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await treatmentsAPI.getAll(page, pageSize, search);
      setTreatments(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error("Failed to fetch treatments", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  // sa useTreatments, idagdag ang useEffect na ito:
  useEffect(() => {
    if (window.location.pathname === "/treatments/add") {
      formModal.open();
      navigate("/treatments/list", { replace: true });
    }
  }, [navigate]);

  const handleDelete = async (id: number, name: string) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Treatment",
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    });
    if (confirmed) {
      try {
        await treatmentsAPI.delete(id);
        await fetchTreatments();
      } catch (error) {
        console.error("Failed to delete treatment", error);
      }
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await treatmentsAPI.toggleActive(id);
      await fetchTreatments();
    } catch (error) {
      console.error("Failed to toggle active status", error);
    }
  };

  const handleView = (treatment: TreatmentResponseDto) => {
    setSelectedTreatment(treatment);
    viewModal.open();
  };

  const handleEdit = (treatment: TreatmentResponseDto) => {
    setEditingTreatment(treatment);
    formModal.open();
  };

  const handleAddNew = () => {
    setEditingTreatment(null);
    formModal.open();
  };

  const handleFormSuccess = () => {
    formModal.close();
    setEditingTreatment(null);
    fetchTreatments();
  };

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return {
    treatments,
    loading,
    search,
    page,
    totalPages,
    totalCount,
    selectedTreatment,
    editingTreatment,
    viewModal,
    formModal,
    handleSearch,
    setPage,
    handleView,
    handleEdit,
    handleDelete,
    handleToggleActive,
    handleAddNew,
    handleFormSuccess,
  };
};
