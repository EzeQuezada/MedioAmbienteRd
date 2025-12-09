// app/(drawer)/(auth)/reportar.tsx
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Text } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function ReportarScreen() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTomarFoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Error', 'Se necesita permiso de cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      setFoto(result.assets[0].uri);
      setFotoBase64(result.assets[0].base64 || null);
    }
  };

  const handleObtenerUbicacion = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Error', 'Se necesita permiso de ubicación');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLatitud(location.coords.latitude);
      setLongitud(location.coords.longitude);
      
      Alert.alert(
        'Ubicación obtenida',
        `Lat: ${location.coords.latitude.toFixed(6)}\nLon: ${location.coords.longitude.toFixed(6)}`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    }
  };

  const handleEnviar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'Ingrese un título');
      return;
    }

    if (!descripcion.trim()) {
      Alert.alert('Error', 'Ingrese una descripción');
      return;
    }

    if (!fotoBase64) {
      Alert.alert('Error', 'Debe tomar una foto');
      return;
    }

    if (latitud === null || longitud === null) {
      Alert.alert('Error', 'Debe obtener la ubicación');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Debe iniciar sesión');
        return;
      }

      const formData = new URLSearchParams();
      formData.append('titulo', titulo.trim());
      formData.append('descripcion', descripcion.trim());
      formData.append('foto', fotoBase64);
      formData.append('latitud', latitud.toString());
      formData.append('longitud', longitud.toString());

      const response = await axios.post(
        'https://adamix.net/medioambiente/def/reportes/',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.exito) {
        Alert.alert('Éxito', response.data.mensaje, [
          {
            text: 'OK',
            onPress: () => {
              limpiarFormulario();
              router.push('/(drawer)/(auth)/mis-reportes');
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.data.mensaje);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo enviar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setTitulo('');
    setDescripcion('');
    setFoto(null);
    setFotoBase64(null);
    setLatitud(null);
    setLongitud(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reportar Daño Ambiental</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Título del reporte"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Describe el daño ambiental"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        {/* Foto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fotografía</Text>
          {foto ? (
            <View>
              <Image source={{ uri: foto }} style={styles.foto} />
              <TouchableOpacity
                style={styles.buttonOutline}
                onPress={handleTomarFoto}
                disabled={loading}>
                <Ionicons name="camera" size={20} color="#2E7D32" />
                <Text style={styles.buttonOutlineText}>Tomar otra foto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handleTomarFoto}
              disabled={loading}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.buttonText}>Tomar Foto</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Ubicación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          {latitud && longitud ? (
            <View style={styles.coordenadasContainer}>
              <View style={styles.coordenadasInfo}>
                <Ionicons name="location" size={24} color="#2E7D32" />
                <View style={styles.coordenadasText}>
                  <Text style={styles.coordenada}>Lat: {latitud.toFixed(6)}</Text>
                  <Text style={styles.coordenada}>Lon: {longitud.toFixed(6)}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.buttonOutline}
                onPress={handleObtenerUbicacion}
                disabled={loading}>
                <Ionicons name="refresh" size={20} color="#2E7D32" />
                <Text style={styles.buttonOutlineText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handleObtenerUbicacion}
              disabled={loading}>
              <Ionicons name="location" size={20} color="#fff" />
              <Text style={styles.buttonText}>Obtener Ubicación</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Botón enviar */}
        <TouchableOpacity
          style={[styles.enviarButton, loading && styles.buttonDisabled]}
          onPress={handleEnviar}
          disabled={loading}>
          <Text style={styles.enviarButtonText}>
            {loading ? 'Enviando...' : 'Enviar Reporte'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  foto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonOutlineText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coordenadasContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
  },
  coordenadasInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  coordenadasText: {
    flex: 1,
  },
  coordenada: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  enviarButton: {
    backgroundColor: '#2E7D32',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  enviarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});