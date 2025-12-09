// app/(drawer)/index.tsx
import { View, ScrollView, StyleSheet, Dimensions, Image } from 'react-native';
import { Text } from 'react-native';
import { useState, useRef } from 'react';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Protegiendo Nuestro Futuro',
    description: 'Trabajamos por un ambiente más limpio y sostenible para las próximas generaciones',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
    color: '#2E7D32',
  },
  {
    id: 2,
    title: 'Conservación de Biodiversidad',
    description: 'Protegemos las áreas naturales y especies endémicas de República Dominicana',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=400&fit=crop',
    color: '#1B5E20',
  },
  {
    id: 3,
    title: 'Únete al Cambio',
    description: 'Sé parte del movimiento por un medio ambiente más saludable',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
    color: '#66BB6A',
  },
];

export default function HomeScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const onScroll = (event: any) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setActiveSlide(slideIndex);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Slider */}
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}>
          {slides.map((slide) => (
            <View key={slide.id} style={styles.slide}>
              <Image
                source={{ uri: slide.image }}
                style={styles.slideImage}
                resizeMode="cover"
              />
              <View style={[styles.slideOverlay, { backgroundColor: slide.color + 'CC' }]}>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideDescription}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                activeSlide === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Contenido Principal */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bienvenido</Text>
          <Text style={styles.cardText}>
            El Ministerio de Medio Ambiente y Recursos Naturales de la República
            Dominicana está comprometido con la protección del medio ambiente y
            el desarrollo sostenible de nuestro país.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nuestra Misión</Text>
          <Text style={styles.cardText}>
            Proteger, conservar y promover el uso sostenible de los recursos
            naturales y el medio ambiente de la República Dominicana para las
            presentes y futuras generaciones.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nuestra Visión</Text>
          <Text style={styles.cardText}>
            Ser una institución modelo en la gestión ambiental, reconocida por
            su efectividad, transparencia y compromiso con el desarrollo
            sostenible del país.
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>120+</Text>
            <Text style={styles.statLabel}>Áreas Protegidas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5000+</Text>
            <Text style={styles.statLabel}>Voluntarios</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Proyectos Activos</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sliderContainer: {
    height: 250,
    backgroundColor: '#000',
  },
  slide: {
    width: width,
    height: 250,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  slideTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  slideDescription: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});