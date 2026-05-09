"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Fuel, Car, Info, Phone, MapPin, Settings, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { vehicleService } from "@/services/vehicleService";
import {
  Vehicle, UpdateVehicleDto,
  Make, Model, Version,
  VehicleType, Traction, Feature, ServiceItem,
  Color, DgtLabel, WarrantyTypeItem, Cuota,
} from "@/interfaces/vehicle.interface";
import { UpdateVehicleSchema, UpdateVehicleFormDto } from "@/validations/vehicleSchemas";
import { updateVehicleAction } from "../vehicleActions/vehicleActions";

const CONDITION_OPTIONS = [
  { value: "used", label: "Usado" },
  { value: "new", label: "Nuevo" },
] as const;

const TRANSMISSION_OPTIONS = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automático" },
] as const;

const PUBLISHER_OPTIONS = [
  { value: "particular", label: "Particular" },
  { value: "professional", label: "Profesional" },
] as const;

const PHONE_CODES = [
  { value: "+34", label: "+34 (España)" },
  { value: "+1", label: "+1 (EE.UU./Canadá)" },
  { value: "+44", label: "+44 (Reino Unido)" },
  { value: "+33", label: "+33 (Francia)" },
  { value: "+49", label: "+49 (Alemania)" },
  { value: "+39", label: "+39 (Italia)" },
  { value: "+52", label: "+52 (México)" },
  { value: "+54", label: "+54 (Argentina)" },
  { value: "+57", label: "+57 (Colombia)" },
  { value: "+56", label: "+56 (Chile)" },
];

interface EditarVehiculoFormProps {
  vehicleId: string;
  userId: string;
}

export default function EditarVehiculoForm({ vehicleId, userId }: EditarVehiculoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [notOwner, setNotOwner] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [tractions, setTractions] = useState<Traction[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [dgtLabels, setDgtLabels] = useState<DgtLabel[]>([]);
  const [warrantyTypes, setWarrantyTypes] = useState<WarrantyTypeItem[]>([]);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);

  const [selectedMakeId, setSelectedMakeId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [filteredVersions, setFilteredVersions] = useState<Version[]>([]);

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedDgtLabelId, setSelectedDgtLabelId] = useState<string | null>(null);
  const [selectedWarrantyTypeId, setSelectedWarrantyTypeId] = useState<string | null>(null);
  const [selectedCuotaId, setSelectedCuotaId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateVehicleFormDto>({
    resolver: zodResolver(UpdateVehicleSchema),
    defaultValues: {
      condition: "used",
      publisher_type: "particular",
      transmission_type: "manual",
      phone_code: "+34",
      id: vehicleId,
    },
  });

  const watchVersionId = watch("version_id");

  useEffect(() => {
    if (watchVersionId && versions.length > 0) {
      const version = versions.find((v) => v.id === watchVersionId);
      if (version) {
        if (version.power) setValue("power", version.power);
        if (version.displacement) setValue("displacement", version.displacement);
      }
    }
  }, [watchVersionId, versions, setValue]);

  useEffect(() => {
    const load = async () => {
      try {
        const [
          makesRes, modelsRes, versionsRes, vehicleTypesRes,
          tractionsRes, featuresRes, servicesRes, colorsRes,
          dgtLabelsRes, warrantyTypesRes, cuotasRes, vehicleRes,
        ] = await Promise.all([
          vehicleService.makes.findAll(),
          vehicleService.models.findAll(),
          vehicleService.versions.findAll(),
          vehicleService.vehicleTypes.findAll(),
          vehicleService.tractions.findAll(),
          vehicleService.features.findAll(),
          vehicleService.services.findAll(),
          vehicleService.colors.findAll(),
          vehicleService.dgtLabels.findAll(),
          vehicleService.warrantyTypes.findAll(),
          vehicleService.cuotas.findAll(),
          vehicleService.vehicles.findById(vehicleId),
        ]);

        if (!vehicleRes.ok || !vehicleRes.data) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const vehicleData = vehicleRes.data;
        const modelsData = modelsRes.data ?? [];
        const versionsData = versionsRes.data ?? [];

        if (vehicleData.profile_id && vehicleData.profile_id !== userId) {
          setNotOwner(true);
          setLoading(false);
          return;
        }

        setMakes(makesRes.data ?? []);
        setModels(modelsData);
        setVersions(versionsData);
        setVehicleTypes(vehicleTypesRes.data ?? []);
        setTractions(tractionsRes.data ?? []);
        setFeatures(featuresRes.data ?? []);
        setServices(servicesRes.data ?? []);
        setColors(colorsRes.data ?? []);
        setDgtLabels(dgtLabelsRes.data ?? []);
        setWarrantyTypes(warrantyTypesRes.data ?? []);
        setCuotas(cuotasRes.data ?? []);
        setVehicle(vehicleData);

        const version = versionsData.find((v) => v.id === vehicleData.version_id);
        if (version) {
          const model = modelsData.find((m) => m.id === version.model_id);
          if (model) {
            setSelectedMakeId(model.make_id);
            setSelectedModelId(version.model_id);
            setFilteredModels(modelsData.filter((m) => m.make_id === model.make_id));
            setFilteredVersions(versionsData.filter((v) => v.model_id === version.model_id));
          }
        }

        setSelectedFeatures(vehicleData.features_ids || []);
        setSelectedServices(vehicleData.services_ids || []);
        setSelectedColorId(vehicleData.color_id || null);
        setSelectedDgtLabelId(vehicleData.dgt_label_id || null);
        setSelectedWarrantyTypeId(vehicleData.warranty_type_id || null);
        setSelectedCuotaId(vehicleData.cuota_id || null);

        reset({
          id: vehicleId,
          title: vehicleData.title,
          description: vehicleData.description,
          condition: vehicleData.condition as "new" | "used",
          publisher_type: vehicleData.publisher_type as "particular" | "professional",
          price: vehicleData.price,
          mileage: vehicleData.mileage,
          lat: vehicleData.lat,
          lng: vehicleData.lng,
          version_id: vehicleData.version_id,
          vehicle_type_id: vehicleData.vehicle_type_id || undefined,
          transmission_type: (vehicleData.transmission_type || "manual") as "manual" | "automatic",
          traction_id: vehicleData.traction_id,
          power: vehicleData.power,
          displacement: vehicleData.displacement || undefined,
          autonomy: vehicleData.autonomy || undefined,
          battery_capacity: vehicleData.battery_capacity || undefined,
          time_to_charge: vehicleData.time_to_charge || undefined,
          license_plate: vehicleData.license_plate || undefined,
          phone_code: vehicleData.phone_code,
          phone: vehicleData.phone,
          email: vehicleData.email,
          features_ids: vehicleData.features_ids || [],
          services_ids: vehicleData.services_ids || [],
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vehicleId, userId, reset]);

  useEffect(() => {
    if (selectedMakeId) {
      setFilteredModels(models.filter((m) => m.make_id === selectedMakeId));
      if (selectedModelId !== null) {
        const stillValid = models.some((m) => m.id === selectedModelId && m.make_id === selectedMakeId);
        if (!stillValid) {
          setSelectedModelId(null);
          setFilteredVersions([]);
          setValue("version_id", undefined as unknown as number);
        }
      }
    }
  }, [selectedMakeId, models, selectedModelId, setValue]);

  useEffect(() => {
    if (selectedModelId !== null) {
      setFilteredVersions(versions.filter((v) => v.model_id === selectedModelId));
    } else {
      setFilteredVersions([]);
    }
  }, [selectedModelId, versions]);

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMakeId(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? Number(e.target.value) : null;
    setSelectedModelId(val);
    setValue("version_id", undefined as unknown as number);
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      setValue("features_ids", next);
      return next;
    });
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
      setValue("services_ids", next);
      return next;
    });
  };

  const onSubmit = async (data: UpdateVehicleFormDto) => {
    startTransition(async () => {
      try {
        const payload: UpdateVehicleDto = {
          ...data,
          features_ids: selectedFeatures,
          services_ids: selectedServices,
          color_id: selectedColorId,
          dgt_label_id: selectedDgtLabelId,
          warranty_type_id: selectedWarrantyTypeId,
          cuota_id: selectedCuotaId,
        };
        await updateVehicleAction(vehicleId, payload);
        toast.success("Vehículo actualizado correctamente");
        router.push("/perfil");
      } catch {
        toast.error("Error al actualizar el vehículo");
      }
    });
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        <p className="mt-4 text-gray-500">Cargando vehículo...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">Vehículo no encontrado</h2>
        <p className="mt-2 text-gray-500">El vehículo que buscas no existe o ha sido eliminado.</p>
        <Link
          href="/perfil"
          className="mt-4 inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Volver al perfil
        </Link>
      </div>
    );
  }

  if (notOwner) {
    return (
      <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">Acceso denegado</h2>
        <p className="mt-2 text-gray-500">No tienes permiso para editar este vehículo.</p>
        <Link
          href="/perfil"
          className="mt-4 inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Volver al perfil
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {vehicle && vehicle.images && vehicle.images.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Car className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Imágenes</h2>
            <span className="text-sm text-gray-400 ml-1">({vehicle.images.length})</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {vehicle.images.map((img) => (
              <div key={img.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Info className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Información básica</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Título del anuncio</label>
            <input
              type="text"
              {...register("title")}
              className={`block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
            <textarea
              rows={4}
              {...register("description")}
              className={`block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors resize-y ${
                errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Condición</label>
            <select
              {...register("condition")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {CONDITION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de vendedor</label>
            <select
              {...register("publisher_type")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {PUBLISHER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.publisher_type && <p className="mt-1 text-xs text-red-500">{errors.publisher_type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio (€)</label>
            <input
              type="number"
              min={0}
              {...register("price", { valueAsNumber: true })}
              className={`block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                errors.price ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            />
            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kilometraje</label>
            <input
              type="number"
              min={0}
              {...register("mileage", { valueAsNumber: true })}
              className={`block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                errors.mileage ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            />
            {errors.mileage && <p className="mt-1 text-xs text-red-500">{errors.mileage.message}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Car className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Datos del vehículo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Marca</label>
            <select
              value={selectedMakeId}
              onChange={handleMakeChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Seleccionar marca</option>
              {makes.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Modelo</label>
            <select
              value={selectedModelId ?? ""}
              onChange={handleModelChange}
              disabled={!selectedMakeId}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Seleccionar modelo</option>
              {filteredModels.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Versión</label>
            <select
              {...register("version_id", { valueAsNumber: true })}
              disabled={selectedModelId === null}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Seleccionar versión</option>
              {filteredVersions.map((v) => (
                <option key={v.id} value={v.id}>{v.name} ({v.year})</option>
              ))}
            </select>
            {errors.version_id && <p className="mt-1 text-xs text-red-500">{errors.version_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de vehículo</label>
            <select
              {...register("vehicle_type_id")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Seleccionar tipo</option>
              {vehicleTypes.map((vt) => (
                <option key={vt.id} value={vt.id}>{vt.name}</option>
              ))}
            </select>
            {errors.vehicle_type_id && <p className="mt-1 text-xs text-red-500">{errors.vehicle_type_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Transmisión</label>
            <select
              {...register("transmission_type")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {TRANSMISSION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tracción</label>
            <select
              {...register("traction_id")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Seleccionar tracción</option>
              {tractions.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {errors.traction_id && <p className="mt-1 text-xs text-red-500">{errors.traction_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Potencia (kW)</label>
            <input
              type="number"
              min={0}
              {...register("power", { valueAsNumber: true })}
              className={`block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                errors.power ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            />
            {errors.power && <p className="mt-1 text-xs text-red-500">{errors.power.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cilindrada (cm³)</label>
            <input
              type="number"
              min={0}
              {...register("displacement", { valueAsNumber: true })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Matrícula</label>
            <input
              type="text"
              {...register("license_plate")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Ej: 1234ABC"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Fuel className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Datos adicionales</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Autonomía (km)</label>
            <input
              type="number"
              min={0}
              {...register("autonomy", { valueAsNumber: true })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacidad batería (kWh)</label>
            <input
              type="number"
              min={0}
              {...register("battery_capacity", { valueAsNumber: true })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiempo de carga (h)</label>
            <input
              type="number"
              min={0}
              {...register("time_to_charge", { valueAsNumber: true })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
            <select
              value={selectedColorId ?? ""}
              onChange={(e) => setSelectedColorId(e.target.value || null)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Sin especificar</option>
              {colors.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Etiqueta DGT</label>
            <select
              value={selectedDgtLabelId ?? ""}
              onChange={(e) => setSelectedDgtLabelId(e.target.value || null)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Sin especificar</option>
              {dgtLabels.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de garantía</label>
            <select
              value={selectedWarrantyTypeId ?? ""}
              onChange={(e) => setSelectedWarrantyTypeId(e.target.value || null)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Sin garantía</option>
              {warrantyTypes.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cuota</label>
            <select
              value={selectedCuotaId ?? ""}
              onChange={(e) => setSelectedCuotaId(e.target.value || null)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Sin cuota</option>
              {cuotas.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.value}€)</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Equipamiento</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Características</h3>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {features.map((f) => (
                <label
                  key={f.id}
                  className="flex items-center gap-2 py-1.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(f.id)}
                    onChange={() => toggleFeature(f.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{f.name}</span>
                </label>
              ))}
              {features.length === 0 && (
                <p className="text-sm text-gray-400 col-span-2">No hay características disponibles</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Servicios</h3>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {services.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-2 py-1.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(s.id)}
                    onChange={() => toggleService(s.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{s.name}</span>
                </label>
              ))}
              {services.length === 0 && (
                <p className="text-sm text-gray-400 col-span-2">No hay servicios disponibles</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Phone className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Contacto</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Código de país</label>
            <select
              {...register("phone_code")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {PHONE_CODES.map((pc) => (
                <option key={pc.value} value={pc.value}>{pc.label}</option>
              ))}
            </select>
            {errors.phone_code && <p className="mt-1 text-xs text-red-500">{errors.phone_code.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
            <input
              type="text"
              {...register("phone")}
              className={`block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              placeholder="600 000 000"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Ubicación</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitud</label>
            <input
              type="number"
              step="any"
              {...register("lat", { valueAsNumber: true })}
              className={`block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                errors.lat ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              placeholder="40.416775"
            />
            {errors.lat && <p className="mt-1 text-xs text-red-500">{errors.lat.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitud</label>
            <input
              type="number"
              step="any"
              {...register("lng", { valueAsNumber: true })}
              className={`block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                errors.lng ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              placeholder="-3.703790"
            />
            {errors.lng && <p className="mt-1 text-xs text-red-500">{errors.lng.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pb-8">
        <Link
          href="/perfil"
          className="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
        >
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
