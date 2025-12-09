// app/(drawer)/voluntariado.tsx
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function VoluntariadoScreen() {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [telefono, setTelefono] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegistro = async () => {
    if (!cedula.trim() || !nombre.trim() || !correo.trim() || !clave.trim() || !telefono.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (!validateEmail(correo)) {
      Alert.alert('Error', 'Correo electrónico inválido');
      return;
    }

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('cedula', cedula.trim());
      formData.append('nombre', nombre.trim());
      formData.append('correo', correo.trim());
      formData.append('clave', clave.trim());
      formData.append('telefono', telefono.trim());

      const response = await axios.post(
        'https://adamix.net/medioambiente/def/voluntarios/',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.exito) {
        Alert.alert('Éxito', response.data.mensaje, [
          {
            text: 'OK',
            onPress: () => {
              setCedula('');
              setNombre('');
              setCorreo('');
              setClave('');
              setTelefono('');
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.data.mensaje);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="heart" size={60} color="#2E7D32" />
          <Text style={styles.headerTitle}>Únete Como Voluntario</Text>
          <Text style={styles.headerSubtitle}>
            Ayúdanos a proteger el medio ambiente de República Dominicana
          </Text>
        </View>

        <View style={styles.requisitosCard}>
          <Text style={styles.requisitosTitle}>Requisitos</Text>
          {[
            'Ser mayor de 18 años',
            'Compromiso con el medio ambiente',
            'Disponibilidad de tiempo',
            'Actitud proactiva y trabajo en equipo',
          ].map((req, index) => (
            <View key={index} style={styles.requisitoItem}>
              <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              <Text style={styles.requisitoText}>{req}</Text>
            </View>
          ))}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Formulario de Registro</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="card" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Cédula"
              value={cedula}
              onChangeText={setCedula}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre Completo"
              value={nombre}
              onChangeText={setNombre}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo Electrónico"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={clave}
              onChangeText={setClave}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleRegistro}
            disabled={loading}>
            <Text style={styles.submitButtonText}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// app/(drawer)/acerca-de.tsx

const desarrolladores = [
  {
    id: 1,
    nombre: 'Tu Nombre Completo',
    matricula: '2020-1234',
    telefono: '809-123-4567',
    telegram: '@tunombre',
    foto: 'https://via.placeholder.com/150',
  },
  // Agregar más miembros aquí
];



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