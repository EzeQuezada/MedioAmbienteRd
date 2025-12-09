// app/(drawer)/servicios.tsx
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  icono?: string;
}

export default function ServiciosScreen() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('https://adamix.net/medioambiente/def/servicios/');
      setServicios(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar servicios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarServicios();
  };

  const renderServicio = ({ item }: { item: Servicio }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="briefcase" size={32} color="#2E7D32" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        <Text style={styles.cardDescription}>{item.descripcion}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando servicios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={64} color="#FF6F00" />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryButton} onPress={cargarServicios}>
          Reintentar
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={servicios}
        renderItem={renderServicio}
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
            <Ionicons name="briefcase-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay servicios disponibles</Text>
          </View>
        }
      />
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
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
});