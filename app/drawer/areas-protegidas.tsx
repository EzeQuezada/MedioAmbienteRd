// app/(drawer)/areas-protegidas.tsx
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Image, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'react-native';
import { useState, useEffect } from 'react';
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
  imagen?: string;
  fecha_creacion?: string;
}

export default function AreasProtegidasScreen() {
  const [areas, setAreas] = useState<AreaProtegida[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<AreaProtegida[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<AreaProtegida | null>(null);

  useEffect(() => {
    cargarAreas();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAreas(areas);
    } else {
      const filtered = areas.filter(area =>
        area.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.ubicacion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAreas(filtered);
    }
  }, [searchQuery, areas]);

  const cargarAreas = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('https://adamix.net/medioambiente/def/areas_protegidas/');
      setAreas(response.data);
      setFilteredAreas(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar áreas protegidas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const cargarDetalle = async (id: number) => {
    try {
      const response = await axios.get(`https://adamix.net/medioambiente/def/areas_protegidas/${id}`);
      setSelectedArea(response.data);
    } catch (err) {
      alert('Error al cargar los detalles del área');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarAreas();
  };

  const renderArea = ({ item }: { item: AreaProtegida }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => cargarDetalle(item.id)}
      activeOpacity={0.7}>
      {item.imagen && (
        <Image
          source={{ uri: item.imagen }}
          style={styles.areaImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.nombre}
        </Text>
        <View style={styles.typeBadge}>
          <Ionicons name="leaf" size={14} color="#2E7D32" />
          <Text style={styles.typeText}>{item.tipo}</Text>
        </View>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.ubicacion}
          </Text>
        </View>
        {item.area && (
          <View style={styles.areaInfo}>
            <Ionicons name="resize" size={16} color="#666" />
            <Text style={styles.areaText}>{item.area} km²</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando áreas protegidas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={64} color="#FF6F00" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={cargarAreas}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar áreas protegidas..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredAreas}
        renderItem={renderArea}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="leaf-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No se encontraron resultados' : 'No hay áreas disponibles'}
            </Text>
          </View>
        }
      />

      {/* Modal de detalle */}
      {selectedArea && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedArea(null)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>

            {selectedArea.imagen && (
              <Image
                source={{ uri: selectedArea.imagen }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>{selectedArea.nombre}</Text>
              
              <View style={styles.modalInfo}>
                <View style={styles.infoRow}>
                  <Ionicons name="leaf" size={20} color="#2E7D32" />
                  <Text style={styles.infoLabel}>Tipo:</Text>
                  <Text style={styles.infoValue}>{selectedArea.tipo}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Ionicons name="location" size={20} color="#2E7D32" />
                  <Text style={styles.infoLabel}>Ubicación:</Text>
                  <Text style={styles.infoValue}>{selectedArea.ubicacion}</Text>
                </View>
                
                {selectedArea.area && (
                  <View style={styles.infoRow}>
                    <Ionicons name="resize" size={20} color="#2E7D32" />
                    <Text style={styles.infoLabel}>Área:</Text>
                    <Text style={styles.infoValue}>{selectedArea.area} km²</Text>
                  </View>
                )}
                
                <View style={styles.infoRow}>
                  <Ionicons name="navigate" size={20} color="#2E7D32" />
                  <Text style={styles.infoLabel}>Coordenadas:</Text>
                  <Text style={styles.infoValue}>
                    {selectedArea.latitud.toFixed(4)}, {selectedArea.longitud.toFixed(4)}
                  </Text>
                </View>
              </View>

              <Text style={styles.modalDescription}>{selectedArea.descripcion}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  areaImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  areaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  areaText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    color: '#999',
    fontSize: 16,
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  modalDescription: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});