"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    control,
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
            <Label className="block text-gray-700 mb-1.5">Título del anuncio</Label>
            <Input
              type="text"
              {...register("title")}
              className={errors.title ? "border-red-500" : "border-gray-300"}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="md:col-span-2">
            <Label className="block text-gray-700 mb-1.5">Descripción</Label>
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
            <Label className="block text-gray-700 mb-1.5">Condición</Label>
            <Controller
              name="condition"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition.message}</p>}
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Tipo de vendedor</Label>
            <Controller
              name="publisher_type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {PUBLISHER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.publisher_type && <p className="mt-1 text-xs text-red-500">{errors.publisher_type.message}</p>}
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Precio (€)</Label>
            <Input
              type="number"
              min={0}
              {...register("price", { valueAsNumber: true })}
              className={errors.price ? "border-red-500" : "border-gray-300"}
            />
            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Kilometraje</Label>
            <Input
              type="number"
              min={0}
              {...register("mileage", { valueAsNumber: true })}
              className={errors.mileage ? "border-red-500" : "border-gray-300"}
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
            <Label className="block text-gray-700 mb-1.5">Marca</Label>
            <Select value={selectedMakeId} onValueChange={(val) => handleMakeChange({ target: { value: val } } as React.ChangeEvent<HTMLSelectElement>)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar marca" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Modelo</Label>
            <Select
              value={selectedModelId?.toString() ?? ""}
              onValueChange={(val) => handleModelChange({ target: { value: val } } as React.ChangeEvent<HTMLSelectElement>)}
              disabled={!selectedMakeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar modelo" />
              </SelectTrigger>
              <SelectContent>
                {filteredModels.map((m) => (
                  <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Versión</Label>
            <Controller
              name="version_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() ?? ""}
                  onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                  disabled={selectedModelId === null}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar versión" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredVersions.map((v) => (
                      <SelectItem key={v.id} value={v.id.toString()}>{v.name} ({v.year})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.version_id && <p className="mt-1 text-xs text-red-500">{errors.version_id.message}</p>}
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Tipo de vehículo</Label>
            <Controller
              name="vehicle_type_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={(val) => field.onChange(val || undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((vt) => (
                      <SelectItem key={vt.id} value={vt.id}>{vt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.vehicle_type_id && <p className="mt-1 text-xs text-red-500">{errors.vehicle_type_id.message}</p>}
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Transmisión</Label>
            <Controller
              name="transmission_type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSMISSION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Tracción</Label>
            <Controller
              name="traction_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={(val) => field.onChange(val || undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tracción" />
                  </SelectTrigger>
                  <SelectContent>
                    {tractions.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.traction_id && <p className="mt-1 text-xs text-red-500">{errors.traction_id.message}</p>}
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Potencia (kW)</Label>
            <Input
              type="number"
              min={0}
              {...register("power", { valueAsNumber: true })}
              className={errors.power ? "border-red-500" : "border-gray-300"}
            />
            {errors.power && <p className="mt-1 text-xs text-red-500">{errors.power.message}</p>}
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Cilindrada (cm³)</Label>
            <Input
              type="number"
              min={0}
              {...register("displacement", { valueAsNumber: true })}
              className="border-gray-300"
            />
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Matrícula</Label>
            <Input
              type="text"
              {...register("license_plate")}
              className="border-gray-300"
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
            <Label className="block text-gray-700 mb-1.5">Autonomía (km)</Label>
            <Input
              type="number"
              min={0}
              {...register("autonomy", { valueAsNumber: true })}
              className="border-gray-300"
            />
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Capacidad batería (kWh)</Label>
            <Input
              type="number"
              min={0}
              {...register("battery_capacity", { valueAsNumber: true })}
              className="border-gray-300"
            />
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Tiempo de carga (h)</Label>
            <Input
              type="number"
              min={0}
              {...register("time_to_charge", { valueAsNumber: true })}
              className="border-gray-300"
            />
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Color</Label>
            <Select value={selectedColorId ?? ""} onValueChange={(val) => setSelectedColorId(val || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Sin especificar" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Etiqueta DGT</Label>
            <Select value={selectedDgtLabelId ?? ""} onValueChange={(val) => setSelectedDgtLabelId(val || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Sin especificar" />
              </SelectTrigger>
              <SelectContent>
                {dgtLabels.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name} ({d.code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Tipo de garantía</Label>
            <Select value={selectedWarrantyTypeId ?? ""} onValueChange={(val) => setSelectedWarrantyTypeId(val || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Sin garantía" />
              </SelectTrigger>
              <SelectContent>
                {warrantyTypes.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Cuota</Label>
            <Select value={selectedCuotaId ?? ""} onValueChange={(val) => setSelectedCuotaId(val || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Sin cuota" />
              </SelectTrigger>
              <SelectContent>
                {cuotas.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name} ({c.value}€)</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <Label
                  key={f.id}
                  className="py-1.5 cursor-pointer group"
                >
                  <Checkbox
                    checked={selectedFeatures.includes(f.id)}
                    onCheckedChange={() => toggleFeature(f.id)}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{f.name}</span>
                </Label>
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
                <Label
                  key={s.id}
                  className="py-1.5 cursor-pointer group"
                >
                  <Checkbox
                    checked={selectedServices.includes(s.id)}
                    onCheckedChange={() => toggleService(s.id)}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{s.name}</span>
                </Label>
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
            <Label className="block text-gray-700 mb-1.5">Código de país</Label>
            <Controller
              name="phone_code"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {PHONE_CODES.map((pc) => (
                      <SelectItem key={pc.value} value={pc.value}>{pc.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.phone_code && <p className="mt-1 text-xs text-red-500">{errors.phone_code.message}</p>}
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Teléfono</Label>
            <Input
              type="text"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : "border-gray-300"}
              placeholder="600 000 000"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Email</Label>
            <Input
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : "border-gray-300"}
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
            <Label className="block text-gray-700 mb-1.5">Latitud</Label>
            <Input
              type="number"
              step="any"
              {...register("lat", { valueAsNumber: true })}
              className={errors.lat ? "border-red-500" : "border-gray-300"}
              placeholder="40.416775"
            />
            {errors.lat && <p className="mt-1 text-xs text-red-500">{errors.lat.message}</p>}
          </div>

          <div>
            <Label className="block text-gray-700 mb-1.5">Longitud</Label>
            <Input
              type="number"
              step="any"
              {...register("lng", { valueAsNumber: true })}
              className={errors.lng ? "border-red-500" : "border-gray-300"}
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
        <Button
          type="submit"
          disabled={isPending}
          className="gap-2 shadow-sm"
        >
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
