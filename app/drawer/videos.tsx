// app/(drawer)/videos.tsx
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Image, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface Video {
  id: number;
  titulo: string;
  descripcion: string;
  url: string;
  thumbnail?: string;
  duracion?: string;
}

export default function VideosScreen() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarVideos();
  }, []);

  const cargarVideos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('https://adamix.net/medioambiente/def/videos/');
      setVideos(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar videos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarVideos();
  };

  const abrirVideo = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert('No se puede abrir este enlace');
      }
    } catch (error) {
      alert('Error al abrir el video');
    }
  };

  const renderVideo = ({ item }: { item: Video }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => abrirVideo(item.url)}
      activeOpacity={0.7}>
      <View style={styles.thumbnailContainer}>
        {item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <Ionicons name="videocam" size={48} color="#fff" />
          </View>
        )}
        <View style={styles.playOverlay}>
          <Ionicons name="play-circle" size={56} color="#fff" />
        </View>
        {item.duracion && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duracion}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.titulo}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.descripcion}
        </Text>
        <View style={styles.watchButton}>
          <Ionicons name="play" size={16} color="#2E7D32" />
          <Text style={styles.watchButtonText}>Ver video</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando videos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={64} color="#FF6F00" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={cargarVideos}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderVideo}
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
            <Ionicons name="videocam-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay videos disponibles</Text>
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
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  watchButtonText: {
    fontSize: 14,
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
});