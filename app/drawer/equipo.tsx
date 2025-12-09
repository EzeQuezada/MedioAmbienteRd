import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

interface Personal {
  id: number;
  nombre: string;
  cargo: string;
  departamento?: string;
  foto?: string;
  email?: string;
  telefono?: string;
}

export function EquipoScreen() {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarPersonal();
  }, []);

  const cargarPersonal = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://adamix.net/medioambiente/def/personal/"
      );
      setPersonal(response.data);
    } catch (err) {
      alert("Error al cargar personal");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderPersonal = ({ item }: { item: Personal }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.foto || "https://via.placeholder.com/100" }}
        style={styles.foto}
      />
      <View style={styles.cardContent}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.cargo}>{item.cargo}</Text>
        {item.departamento && (
          <Text style={styles.departamento}>{item.departamento}</Text>
        )}
        {item.email && (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`mailto:${item.email}`)}
          >
            <Ionicons name="mail" size={16} color="#2E7D32" />
            <Text style={styles.contactText}>{item.email}</Text>
          </TouchableOpacity>
        )}
        {item.telefono && (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`tel:${item.telefono}`)}
          >
            <Ionicons name="call" size={16} color="#2E7D32" />
            <Text style={styles.contactText}>{item.telefono}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <FlatList
      data={personal}
      renderItem={renderPersonal}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={cargarPersonal}
          colors={["#2E7D32"]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  cardText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  valoresCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  valoresTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 16,
  },
  valorItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  valorText: {
    fontSize: 16,
    color: "#666",
  },
  list: {
    padding: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
  },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    maxHeight: "80%",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  modalCategory: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  modalCategoryText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  foto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cargo: {
    fontSize: 16,
    color: "#2E7D32",
    fontWeight: "600",
    marginTop: 4,
  },
  departamento: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  contactText: {
    fontSize: 14,
    color: "#2E7D32",
  },
});
