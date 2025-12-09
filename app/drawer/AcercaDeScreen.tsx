// Aquí solo AcercaDeScreen con sus estilos
import { View, ScrollView, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const desarrolladores = [
  {
    id: 1,
    nombre: 'Tu Nombre Completo',
    matricula: '2020-1234',
    telefono: '809-123-4567',
    telegram: '@tunombre',
    foto: 'https://via.placeholder.com/150',
  },
];

export default function AcercaDeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="code-slash" size={60} color="#2E7D32" />
        <Text style={styles.headerTitle}>Equipo de Desarrollo</Text>
        <Text style={styles.headerSubtitle}>ITLA 3-2025</Text>
      </View>

      {desarrolladores.map((dev) => (
        <View key={dev.id} style={styles.devCard}>
          <Image source={{ uri: dev.foto }} style={styles.foto} />
          <View style={styles.devInfo}>
            <Text style={styles.nombre}>{dev.nombre}</Text>
            <Text style={styles.matricula}>Matrícula: {dev.matricula}</Text>

            <View style={styles.contactRow}>
              <View style={styles.contactItem}>
                <Ionicons name="call" size={16} color="#666" />
                <Text style={styles.contactText}>{dev.telefono}</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="send" size={16} color="#666" />
                <Text style={styles.contactText}>{dev.telegram}</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => Linking.openURL(`tel:${dev.telefono.replace(/-/g, '')}`)}>
                <Ionicons name="call" size={18} color="#fff" />
                <Text style={styles.contactButtonText}>Llamar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => Linking.openURL(`https://t.me/${dev.telegram.replace('@', '')}`)}>
                <Ionicons name="send" size={18} color="#fff" />
                <Text style={styles.contactButtonText}>Telegram</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Proyecto Final</Text>
        <Text style={styles.footerText}>
          Aplicación desarrollada como proyecto final del curso de Desarrollo de Apps en ITLA,
          periodo 3-2025.
        </Text>
        <Text style={styles.version}>Versión 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  requisitosCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  requisitosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  requisitoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  requisitoText: {
    fontSize: 16,
    color: '#666',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
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
  submitButton: {
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
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  devCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  foto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  devInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  matricula: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  contactRow: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  version: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
  },
});