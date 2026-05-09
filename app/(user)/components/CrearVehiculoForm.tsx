"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft, Upload, X, ImagePlus,
  Fuel, Car, Info, Phone, MapPin, Settings,
} from "lucide-react";
import Link from "next/link";
import { vehicleService } from "@/services/vehicleService";
import {
  CreateVehicleDto,
  Make, Model, Version,
  VehicleType, Traction, Feature, ServiceItem,
  Color, DgtLabel, WarrantyTypeItem, Cuota,
} from "@/interfaces/vehicle.interface";
import { CreateVehicleSchema, CreateVehicleFormDto } from "@/validations/vehicleSchemas";
import { createVehicleAction } from "../vehicleActions/vehicleActions";

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

interface ImageFile {
  file: File;
  preview: string;
}

export default function CrearVehiculoForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateVehicleFormDto>({
    resolver: zodResolver(CreateVehicleSchema),
    defaultValues: {
      condition: "used",
      publisher_type: "particular",
      transmission_type: "manual",
      phone_code: "+34",
      price: 0,
      mileage: 0,
      power: 0,
      lat: 0,
      lng: 0,
      features_ids: [],
      services_ids: [],
    },
  });

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedDgtLabelId, setSelectedDgtLabelId] = useState<string | null>(null);
  const [selectedWarrantyTypeId, setSelectedWarrantyTypeId] = useState<string | null>(null);
  const [selectedCuotaId, setSelectedCuotaId] = useState<string | null>(null);

  const watchVersionId = watch("version_id");

  useEffect(() => {
    if (watchVersionId) {
      const version = versions.find((v) => v.id === watchVersionId);
      if (version) {
        if (version.power) setValue("power", version.power);
        if (version.displacement) setValue("displacement", version.displacement);
      }
    }
  }, [watchVersionId, versions, setValue]);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [
          makesRes, modelsRes, versionsRes, vehicleTypesRes,
          tractionsRes, featuresRes, servicesRes, colorsRes,
          dgtLabelsRes, warrantyTypesRes, cuotasRes,
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
        ]);
        setMakes(makesRes.data ?? []);
        setModels(modelsRes.data ?? []);
        setVersions(versionsRes.data ?? []);
        setVehicleTypes(vehicleTypesRes.data ?? []);
        setTractions(tractionsRes.data ?? []);
        setFeatures(featuresRes.data ?? []);
        setServices(servicesRes.data ?? []);
        setColors(colorsRes.data ?? []);
        setDgtLabels(dgtLabelsRes.data ?? []);
        setWarrantyTypes(warrantyTypesRes.data ?? []);
        setCuotas(cuotasRes.data ?? []);
      } catch {
        toast.error("Error al cargar datos del catálogo");
      }
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    if (selectedMakeId) {
      setFilteredModels(models.filter((m) => m.make_id === selectedMakeId));
      setSelectedModelId(null);
      setFilteredVersions([]);
      setValue("version_id", undefined as unknown as number);
    } else {
      setFilteredModels([]);
    }
  }, [selectedMakeId, models, setValue]);

  useEffect(() => {
    if (selectedModelId !== null) {
      setFilteredVersions(versions.filter((v) => v.model_id === selectedModelId));
      setValue("version_id", undefined as unknown as number);
    } else {
      setFilteredVersions([]);
    }
  }, [selectedModelId, versions, setValue]);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const handleImageSelect = useCallback((files: FileList | File[]) => {
    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" excede 10MB`);
        continue;
      }
      validFiles.push(file);
    }
    const maxTotal = 20;
    const remaining = maxTotal - images.length;
    const toAdd = validFiles.slice(0, remaining);
    if (validFiles.length > remaining) {
      toast.warning(`Máximo ${maxTotal} imágenes`);
    }
    setImages((prev) => [
      ...prev,
      ...toAdd.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  }, [images.length]);

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newArr = [...prev];
      URL.revokeObjectURL(newArr[index].preview);
      newArr.splice(index, 1);
      return newArr;
    });
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMakeId(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? Number(e.target.value) : null;
    setSelectedModelId(val);
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

  const onSubmit = async (data: CreateVehicleFormDto) => {
    startTransition(async () => {
      try {
        const payload: CreateVehicleDto = {
          ...data,
          features_ids: selectedFeatures,
          services_ids: selectedServices,
          color_id: selectedColorId,
          dgt_label_id: selectedDgtLabelId,
          warranty_type_id: selectedWarrantyTypeId,
          cuota_id: selectedCuotaId,
        };
        await createVehicleAction(payload, images.map((i) => i.file));
        toast.success("Vehículo publicado correctamente");
        router.push("/perfil");
      } catch {
        toast.error("Error al publicar el vehículo");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <ImagePlus className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Imágenes</h2>
          <span className="text-sm text-gray-400 ml-1">({images.length}/20)</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
              <img
                src={img.preview}
                alt={`Imagen ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {images.length < 20 && (
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageSelect(e.dataTransfer.files); }}
              className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center p-2 ${
                dragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleImageSelect(e.target.files)}
              />
              <Upload className="h-5 w-5 text-gray-400" />
              <span className="text-xs text-gray-400 leading-tight">Añadir foto</span>
            </label>
          )}
        </div>
        <p className="text-xs text-gray-400">
          Formatos: JPG, PNG, WebP. Máx 10MB por imagen. Arastra y suelta para añadir.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Info className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Información básica</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Título del anuncio *</label>
            <input
              type="text"
              {...register("title")}
              className={`block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              placeholder="Ej: BMW Serie 3 320d 2019"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción *</label>
            <textarea
              rows={4}
              {...register("description")}
              className={`block w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors resize-y ${
                errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              placeholder="Describe el estado, el equipamiento, el historial de mantenimiento..."
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Condición *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de vendedor *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio (€) *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kilometraje *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Marca *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Modelo *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Versión *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de vehículo *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tracción *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Potencia (kW) *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Código de país *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitud *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitud *</label>
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
          {isPending ? "Publicando..." : "Publicar vehículo"}
        </button>
      </div>
    </form>
  );
}
