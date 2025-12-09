// app/(drawer)/mapa-areas.tsx
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native';
import { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface AreaProtegida {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  ubicacion: string;
  latitud: number;
  longitud: number;
  area?: string;
}

export default function MapaAreasScreen() {
  const [areas, setAreas] = useState<AreaProtegida[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<AreaProtegida | null>(null);

  const initialRegion = {
    latitude: 18.735693,
    longitude: -70.162651,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  };

  useEffect(() => {
    cargarAreas();
  }, []);

  const cargarAreas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://adamix.net/medioambiente/def/areas_protegidas/');
      setAreas(response.data);
    } catch (error) {
      alert('Error al cargar áreas protegidas');
    } finally {
      setLoading(false);
    }
  };

  const cargarDetalle = async (id: number) => {
    try {
      const response = await axios.get(`https://adamix.net/medioambiente/def/areas_protegidas/${id}`);
      setSelectedArea(response.data);
    } catch (error) {
      alert('Error al cargar los detalles');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton>
        {areas.map((area) => (
          <Marker
            key={area.id}
            coordinate={{
              latitude: area.latitud,
              longitude: area.longitud,
            }}
            title={area.nombre}
            description={area.tipo}
            pinColor="#2E7D32"
            onPress={() => cargarDetalle(area.id)}
          />
        ))}
      </MapView>

      {/* Card de detalle */}
      {selectedArea && (
        <View style={styles.detailCard}>
          <ScrollView>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{selectedArea.nombre}</Text>
              <TouchableOpacity
                onPress={() => setSelectedArea(null)}
                style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.detailInfo}>
              <View style={styles.infoBadge}>
                <Ionicons name="leaf" size={16} color="#2E7D32" />
                <Text style={styles.infoBadgeText}>{selectedArea.tipo}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location" size={18} color="#666" />
                <Text style={styles.infoText}>{selectedArea.ubicacion}</Text>
              </View>

              {selectedArea.area && (
                <View style={styles.infoRow}>
                  <Ionicons name="resize" size={18} color="#666" />
                  <Text style={styles.infoText}>{selectedArea.area} km²</Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Ionicons name="navigate" size={18} color="#666" />
                <Text style={styles.infoText}>
                  {selectedArea.latitud.toFixed(4)}, {selectedArea.longitud.toFixed(4)}
                </Text>
              </View>
            </View>

            <View style={styles.detailDescription}>
              <Text style={styles.descriptionTitle}>Descripción</Text>
              <Text style={styles.descriptionText}>{selectedArea.descripcion}</Text>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Contador de áreas */}
      <View style={styles.counterBadge}>
        <Ionicons name="leaf" size={16} color="#fff" />
        <Text style={styles.counterText}>{areas.length} áreas protegidas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  detailCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    maxHeight: '50%',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  closeButton: {
    padding: 4,
  },
  detailInfo: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
    gap: 4,
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  detailDescription: {
    padding: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  counterBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});