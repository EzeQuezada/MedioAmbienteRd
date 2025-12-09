// app/(drawer)/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

function CustomDrawerContent(props: any) {
  const { usuario, isAuthenticated, logout } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <MaterialCommunityIcons name="leaf-circle" size={64} color="#fff" />
        {isAuthenticated && usuario ? (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{usuario.nombre}</Text>
            <Text style={styles.userEmail}>{usuario.correo}</Text>
          </View>
        ) : (
          <Text style={styles.appName}>Medio Ambiente RD</Text>
        )}
      </View>

      {/* Menú Público */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menú Principal</Text>
        
        <DrawerItem
          label="Inicio"
          icon={({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )}
          onPress={() => router.push('/(drawer)/')}
        />
        
        <DrawerItem
          label="Sobre Nosotros"
          icon={({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          )}
          onPress={() => router.push('/(drawer)/sobre-nosotros')}
        />
        
        <DrawerItem
          label="Servicios"
          icon={({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          )}
          onPress={() => router.push('/(drawer)/servicios')}
        />
        
        <DrawerItem
          label="Noticias"
          icon={({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          )}
          onPress={() => router.push('/(drawer)/noticias')}
        />
        
        <DrawerItem
          label="Videos Educativos"
          icon={({ color, size }) => (
            <Ionicons name="videocam" size={size} color={color} />
          )}
          onPress={() => router.push('/(drawer)/videos')}
        />
        
        <DrawerItem
          label="Áreas Protegidas"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="pine-tree" size={size} color={color} />
          )}
          onPress={() => router.push('/(drawer)/areas-protegidas')}
        />
        
        <DrawerItem
          label="Mapa de Áreas"
          icon={({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          )}
          onPress={() => router.push('/(drawer)/mapa-areas')}
        />
        
        <DrawerItem
          label="Medidas Ambientales"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="leaf" size={size} color={color} />
          )}
          onPress={() => router.push('/(drawer)/medidas')}
        />
        
        <DrawerItem
          label="Equipo"
          icon={({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          )}
          onPress={() => router.push('/(drawer)/equipo')}
        />
        
        <DrawerItem
          label="Voluntariado"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="hand-heart" size={size} color={color} />
          )}
          onPress={() => router.push('/(drawer)/voluntariado')}
        />
        
        <DrawerItem
          label="Acerca de"
          icon={({ color, size }) => (
            <Ionicons name="code-slash" size={size} color={color} />
          )}
          onPress={() => router.push('/(drawer)/acerca-de')}
        />
      </View>

      {/* Autenticación */}
      {!isAuthenticated ? (
        <View style={styles.section}>
          <DrawerItem
            label="Iniciar Sesión"
            icon={({ color, size }) => (
              <Ionicons name="log-in" size={size} color={color} />
            )}
            onPress={() => router.push('/(drawer)/(auth)/login')}
          />
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Cuenta</Text>
          
          <DrawerItem
            label="Normativas"
            icon={({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            )}
            onPress={() => router.push('/(drawer)/(auth)/normativas')}
          />
          
          <DrawerItem
            label="Reportar Daño"
            icon={({ color, size }) => (
              <Ionicons name="alert-circle" size={size} color={color} />
            )}
            onPress={() => router.push('/(drawer)/(auth)/reportar')}
          />
          
          <DrawerItem
            label="Mis Reportes"
            icon={({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            )}
            onPress={() => router.push('/(drawer)/(auth)/mis-reportes')}
          />
          
          <DrawerItem
            label="Mapa de Reportes"
            icon={({ color, size }) => (
              <Ionicons name="location" size={size} color={color} />
            )}
            onPress={() => router.push('/(drawer)/(auth)/mapa-reportes')}
          />
          
          <DrawerItem
            label="Cambiar Contraseña"
            icon={({ color, size }) => (
              <Ionicons name="key" size={size} color={color} />
            )}
            onPress={() => router.push('/(drawer)/(auth)/cambiar-clave')}
          />
          
          <DrawerItem
            label="Cerrar Sesión"
            icon={({ color, size }) => (
              <Ionicons name="log-out" size={size} color={color} />
            )}
            onPress={async () => {
              await logout();
              router.replace('/(drawer)/');
            }}
          />
        </View>
      )}
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#2E7D32',
        drawerInactiveTintColor: '#666',
      }}>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Inicio',
          title: 'Medio Ambiente RD',
        }}
      />
      <Drawer.Screen
        name="sobre-nosotros"
        options={{
          drawerLabel: 'Sobre Nosotros',
          title: 'Sobre Nosotros',
        }}
      />
      <Drawer.Screen
        name="servicios"
        options={{
          drawerLabel: 'Servicios',
          title: 'Servicios',
        }}
      />
      <Drawer.Screen
        name="noticias"
        options={{
          drawerLabel: 'Noticias',
          title: 'Noticias Ambientales',
        }}
      />
      <Drawer.Screen
        name="videos"
        options={{
          drawerLabel: 'Videos',
          title: 'Videos Educativos',
        }}
      />
      <Drawer.Screen
        name="areas-protegidas"
        options={{
          drawerLabel: 'Áreas Protegidas',
          title: 'Áreas Protegidas',
        }}
      />
      <Drawer.Screen
        name="mapa-areas"
        options={{
          drawerLabel: 'Mapa de Áreas',
          title: 'Mapa de Áreas Protegidas',
        }}
      />
      <Drawer.Screen
        name="medidas"
        options={{
          drawerLabel: 'Medidas',
          title: 'Medidas Ambientales',
        }}
      />
      <Drawer.Screen
        name="equipo"
        options={{
          drawerLabel: 'Equipo',
          title: 'Equipo del Ministerio',
        }}
      />
      <Drawer.Screen
        name="voluntariado"
        options={{
          drawerLabel: 'Voluntariado',
          title: 'Voluntariado',
        }}
      />
      <Drawer.Screen
        name="acerca-de"
        options={{
          drawerLabel: 'Acerca de',
          title: 'Acerca de',
        }}
      />
      <Drawer.Screen
        name="(auth)"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: '#2E7D32',
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#E0E0E0',
    fontSize: 14,
    marginTop: 4,
  },
  appName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
});