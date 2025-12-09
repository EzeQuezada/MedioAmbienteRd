// app/(drawer)/noticias.tsx
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  imagen?: string;
  fuente?: string;
}

export default function NoticiasScreen() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cargarNoticias = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('https://adamix.net/medioambiente/def/noticias/');
      setNoticias(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar noticias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarNoticias();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderNoticia = ({ item }: { item: Noticia }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedNoticia(item)}
      activeOpacity={0.7}>
      {item.imagen && (
        <Image
          source={{ uri: item.imagen }}
          style={styles.noticiaImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.titulo}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={3}>
          {item.contenido}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.dateText}>{formatDate(item.fecha)}</Text>
          </View>
          {item.fuente && (
            <View style={styles.sourceContainer}>
              <Ionicons name="newspaper-outline" size={16} color="#666" />
              <Text style={styles.sourceText}>{item.fuente}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando noticias...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={64} color="#FF6F00" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={cargarNoticias}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={noticias}
        renderItem={renderNoticia}
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
            <Ionicons name="newspaper-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay noticias disponibles</Text>
          </View>
        }
      />

      {/* Modal de detalle */}
      {selectedNoticia && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedNoticia(null)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>

            {selectedNoticia.imagen && (
              <Image
                source={{ uri: selectedNoticia.imagen }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>{selectedNoticia.titulo}</Text>
              <View style={styles.modalMeta}>
                <Text style={styles.modalDate}>{formatDate(selectedNoticia.fecha)}</Text>
                {selectedNoticia.fuente && (
                  <Text style={styles.modalSource}>Fuente: {selectedNoticia.fuente}</Text>
                )}
              </View>
              <Text style={styles.modalText}>{selectedNoticia.contenido}</Text>
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
  list: {
    padding: 16,
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
  noticiaImage: {
    width: '100%',
    height: 180,
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
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
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
    marginBottom: 12,
  },
  modalMeta: {
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  modalSource: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  modalText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});