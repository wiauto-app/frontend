"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Gauge,
  Calendar,
  Fuel,
  Settings,
  Battery,
  Zap,
  Phone,
  Mail,
  ArrowLeft,
  Car,
  Tag,
  Heart,
  Share2,
  Shield,
  BadgeCheck,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { vehicleService } from "@/services/vehicleService";
import { Vehicle } from "@/interfaces/vehicle.interface";
import Link from "next/link";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(km: number): string {
  return new Intl.NumberFormat("es-ES").format(km) + " km";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPower(kw: number): string {
  const cv = Math.round(kw * 1.36);
  return `${cv} CV (${kw} kW)`;
}

function formatDisplacement(cc: number): string | null {
  return cc > 0 ? `${cc} cc` : null;
}

function getConditionLabel(condition: string): string {
  return condition === "new" ? "Nuevo" : "Usado";
}

function getTransmissionLabel(transmission: string): string {
  return transmission === "automatic" ? "Automático" : "Manual";
}

function getPublisherLabel(type: string): string {
  return type === "professional" ? "Vendedor profesional" : "Particular";
}

function getImageUrl(images: Vehicle["images"] | undefined, index: number): string {
  if (!images || images.length === 0) return "/placeholder-car.jpg";
  const img = images[index % images.length];
  return img?.url || "/placeholder-car.jpg";
}

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    vehicleService.vehicles
      .findById(id)
      .then((response) => {
        if (!response.ok) {
          setError("No se pudo cargar el vehículo");
          return;
        }
        setVehicle(response.data);
        setError(null);
      })
      .catch(() => {
        setError("No se pudo cargar el vehículo");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const nextImage = () => {
    if (!vehicle?.images) return;
    setCurrentImage((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    if (!vehicle?.images) return;
    setCurrentImage((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-gray-500">Cargando vehículo...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <Car className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Vehículo no encontrado</h2>
          <p className="mt-2 text-gray-500">{error || "El vehículo que buscas no existe o ha sido eliminado."}</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const displacement = formatDisplacement(vehicle.displacement);
  const isEv = vehicle.battery_capacity > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={getImageUrl(vehicle.images, currentImage)}
                  alt={vehicle.title}
                  className="w-full h-full object-cover"
                />
                {vehicle.images && vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {vehicle.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={`h-2 rounded-full transition-all ${
                            i === currentImage ? "w-6 bg-white" : "w-2 bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                    {getConditionLabel(vehicle.condition)}
                  </span>
                  {vehicle.is_featured && (
                    <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      Destacado
                    </span>
                  )}
                </div>
              </div>
              {/* Thumbnails */}
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {vehicle.images.slice(0, 6).map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImage(i)}
                      className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-colors ${
                        i === currentImage ? "border-blue-600" : "border-transparent"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & price */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{vehicle.title}</h1>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(vehicle.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge className="h-4 w-4" />
                      {vehicle.views} visitas
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`p-2 rounded-full border transition-colors ${
                      saved
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "border-gray-200 text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                  </button>
                  <button className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-3xl font-bold text-blue-600">{formatPrice(vehicle.price)}</span>
              </div>
            </div>

            {/* Specs grid */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Gauge className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Kilometraje</p>
                    <p className="text-sm font-medium text-gray-900">{formatMileage(vehicle.mileage)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Transmisión</p>
                    <p className="text-sm font-medium text-gray-900">{getTransmissionLabel(vehicle.transmission_type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Zap className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Potencia</p>
                    <p className="text-sm font-medium text-gray-900">{formatPower(vehicle.power)}</p>
                  </div>
                </div>
                {displacement && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Fuel className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Cilindrada</p>
                      <p className="text-sm font-medium text-gray-900">{displacement}</p>
                    </div>
                  </div>
                )}
                {isEv && (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Battery className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Batería</p>
                        <p className="text-sm font-medium text-gray-900">{vehicle.battery_capacity} kWh</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Zap className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Autonomía</p>
                        <p className="text-sm font-medium text-gray-900">{vehicle.autonomy} km</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{vehicle.description}</p>
              </div>
            )}

            {/* Features */}
            {vehicle.features_ids && vehicle.features_ids.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Características</h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features_ids.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full"
                    >
                      <Tag className="h-3.5 w-3.5" />
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  {vehicle.publisher_type === "professional" ? (
                    <Building2 className="h-6 w-6 text-gray-500" />
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{getPublisherLabel(vehicle.publisher_type)}</p>
                  <p className="text-sm text-gray-500">Publicado el {formatDate(vehicle.created_at)}</p>
                </div>
              </div>

              <div className="space-y-3">
                {vehicle.phone && (
                  <a
                    href={`tel:${vehicle.phone_code}${vehicle.phone}`}
                    className="flex items-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors justify-center"
                  >
                    <Phone className="h-5 w-5" />
                    Llamar
                  </a>
                )}
                {vehicle.email && (
                  <a
                    href={`mailto:${vehicle.email}`}
                    className="flex items-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors justify-center"
                  >
                    <Mail className="h-5 w-5" />
                    Enviar email
                  </a>
                )}
              </div>

              {vehicle.phone && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500">
                    Tel: <span className="font-medium text-gray-900">{vehicle.phone_code} {vehicle.phone}</span>
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 justify-center">
                <Shield className="h-4 w-4" />
                <span>Compra segura con WiAuto</span>
              </div>
            </div>

            {/* Location */}
            {vehicle.lat && vehicle.lng && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  Ubicación
                </h3>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${vehicle.lng - 0.01},${vehicle.lat - 0.008},${vehicle.lng + 0.01},${vehicle.lat + 0.008}&marker=${vehicle.lat},${vehicle.lng}`}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Reference info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-3">Información de referencia</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID Vehículo</span>
                  <span className="font-mono text-gray-900">{vehicle.id.slice(0, 8)}</span>
                </div>
                {vehicle.license_plate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Matrícula</span>
                    <span className="text-gray-900">{vehicle.license_plate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado</span>
                  <span className="text-gray-900">{getConditionLabel(vehicle.condition)}</span>
                </div>
                {vehicle.expires_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expira</span>
                    <span className="text-gray-900">{formatDate(vehicle.expires_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
