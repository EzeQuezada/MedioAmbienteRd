// app/(drawer)/sobre-nosotros.tsx
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SobreNosotrosScreen() {
  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800",
        }}
        style={styles.headerImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle" size={32} color="#2E7D32" />
            <Text style={styles.cardTitle}>Historia</Text>
          </View>
          <Text style={styles.cardText}>
            El Ministerio de Medio Ambiente y Recursos Naturales fue creado
            mediante la Ley 64-00 sobre Medio Ambiente y Recursos Naturales, con
            la misión de establecer la política nacional sobre medio ambiente y
            recursos naturales del país.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flag" size={32} color="#2E7D32" />
            <Text style={styles.cardTitle}>Misión</Text>
          </View>
          <Text style={styles.cardText}>
            Proteger, conservar y promover el uso sostenible de los recursos
            naturales y el medio ambiente de la República Dominicana para las
            presentes y futuras generaciones, mediante la formulación y
            aplicación de políticas, normas y estrategias.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="eye" size={32} color="#2E7D32" />
            <Text style={styles.cardTitle}>Visión</Text>
          </View>
          <Text style={styles.cardText}>
            Ser una institución modelo en la gestión ambiental, reconocida por
            su efectividad, transparencia y compromiso con el desarrollo
            sostenible del país, garantizando un ambiente sano para todos los
            dominicanos.
          </Text>
        </View>

        <View style={styles.valoresCard}>
          <Text style={styles.valoresTitle}>Nuestros Valores</Text>
          {[
            {
              icon: "checkmark-circle",
              text: "Compromiso con el medio ambiente",
            },
            {
              icon: "checkmark-circle",
              text: "Transparencia y rendición de cuentas",
            },
            { icon: "checkmark-circle", text: "Participación ciudadana" },
            { icon: "checkmark-circle", text: "Innovación y sostenibilidad" },
            {
              icon: "checkmark-circle",
              text: "Responsabilidad intergeneracional",
            },
          ].map((valor, index) => (
            <View key={index} style={styles.valorItem}>
              <Ionicons name={valor.icon as any} size={20} color="#2E7D32" />
              <Text style={styles.valorText}>{valor.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// app/(drawer)/medidas.tsx

// app/(drawer)/equipo.tsx

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
