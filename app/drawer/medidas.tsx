import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

interface Medida {
  id: number;
  titulo: string;
  descripcion: string;
  categoria?: string;
  icono?: string;
}

export function MedidasScreen() {
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMedida, setSelectedMedida] = useState<Medida | null>(null);

  useEffect(() => {
    cargarMedidas();
  }, []);

  const cargarMedidas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://adamix.net/medioambiente/def/medidas/"
      );
      setMedidas(response.data);
    } catch (err) {
      alert("Error al cargar medidas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const cargarDetalle = async (id: number) => {
    try {
      const response = await axios.get(
        `https://adamix.net/medioambiente/def/medidas/${id}`
      );
      setSelectedMedida(response.data);
    } catch (err) {
      alert("Error al cargar detalle");
    }
  };

  const renderMedida = ({ item }: { item: Medida }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => cargarDetalle(item.id)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="leaf" size={28} color="#2E7D32" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        {item.categoria && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.categoria}</Text>
          </View>
        )}
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.descripcion}
        </Text>
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
        data={medidas}
        renderItem={renderMedida}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={cargarMedidas}
            colors={["#2E7D32"]}
          />
        }
      />

      {selectedMedida && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedMedida(null)}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedMedida.titulo}</Text>
            {selectedMedida.categoria && (
              <View style={styles.modalCategory}>
                <Text style={styles.modalCategoryText}>
                  {selectedMedida.categoria}
                </Text>
              </View>
            )}
            <Text style={styles.modalText}>{selectedMedida.descripcion}</Text>
          </View>
        </View>
      )}
    </View>
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
