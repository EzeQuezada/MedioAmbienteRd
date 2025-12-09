import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Reporte {
  id: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  foto: string;
  latitud: number;
  longitud: number;
  fecha: string;
  estado: 'Pendiente' | 'En Proceso' | 'Resuelto';
  comentario_ministerio?: string;
}

export default function MisReportesScreen() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState<Reporte | null>(null);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get('https://adamix.net/medioambiente/def/reportes/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportes(response.data);
    } catch (err) {
      alert('Error al cargar reportes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const cargarDetalle = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`https://adamix.net/medioambiente/def/reportes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedReporte(response.data);
    } catch (err) {
      alert('Error al cargar detalle');
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return '#FF9800';
      case 'En Proceso': return '#2196F3';
      case 'Resuelto': return '#4CAF50';
      default: return '#999';
    }
  };

  const renderReporte = ({ item }: { item: Reporte }) => (
    <TouchableOpacity style={styles.card} onPress={() => cargarDetalle(item.id)}>
      <Image source={{ uri: item.foto }} style={styles.foto} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.codigo}>{item.codigo}</Text>
          <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
            <Text style={styles.estadoText}>{item.estado}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.descripcion}</Text>
        <View style={styles.cardFooter}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.dateText}>{new Date(item.fecha).toLocaleDateString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reportes}
        renderItem={renderReporte}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={cargarReportes} colors={['#2E7D32']} />
        }
      />

      {selectedReporte && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedReporte(null)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Image source={{ uri: selectedReporte.foto }} style={styles.modalImage} />
            <View style={styles.modalBody}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalCodigo}>{selectedReporte.codigo}</Text>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(selectedReporte.estado) }]}>
                  <Text style={styles.estadoText}>{selectedReporte.estado}</Text>
                </View>
              </View>
              <Text style={styles.modalTitle}>{selectedReporte.titulo}</Text>
              <Text style={styles.modalDate}>{new Date(selectedReporte.fecha).toLocaleString()}</Text>
              <Text style={styles.modalDescription}>{selectedReporte.descripcion}</Text>
              {selectedReporte.comentario_ministerio && (
                <View style={styles.comentarioCard}>
                  <Text style={styles.comentarioTitle}>Comentario del Ministerio:</Text>
                  <Text style={styles.comentarioText}>{selectedReporte.comentario_ministerio}</Text>
                </View>
              )}
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
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  numero: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  downloadText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  foto: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
  codigo: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalCodigo: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  comentarioCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  comentarioTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  comentarioText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});