import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, FlatList, SafeAreaView,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

// ⚠️ Substitua pela sua chave da Google Maps API
const GOOGLE_API_KEY = 'SUA_CHAVE_AQUI';
const RAIO_KM = 10000; // 10km em metros

export default function MapScreen({ onVoltar }) {
  const [localizacao, setLocalizacao] = useState(null);
  const [sorveterias, setSorveterias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [selecionada, setSelecionada] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    iniciar();
  }, []);

  const iniciar = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da sua localização para mostrar as sorveterias próximas.');
        setCarregando(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = loc.coords;
      setLocalizacao({ latitude, longitude });
      await buscarSorveterias(latitude, longitude);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível obter sua localização.');
    } finally {
      setCarregando(false);
    }
  };

  const buscarSorveterias = async (lat, lng) => {
    if (GOOGLE_API_KEY === 'SUA_CHAVE_AQUI') {
      // Dados fictícios para demonstração
      setSorveterias([
        { place_id: '1', name: 'Gelato MEC - Centro', vicinity: 'Rua das Flores, 123', geometry: { location: { lat: lat + 0.01, lng: lng + 0.008 } }, rating: 4.8 },
        { place_id: '2', name: 'Gelato MEC - Norte', vicinity: 'Av. Principal, 456', geometry: { location: { lat: lat + 0.03, lng: lng - 0.015 } }, rating: 4.6 },
        { place_id: '3', name: 'Gelato MEC - Sul', vicinity: 'Praça da Liberdade, 78', geometry: { location: { lat: lat - 0.025, lng: lng + 0.02 } }, rating: 4.9 },
        { place_id: '4', name: 'Gelato MEC - Shopping', vicinity: 'Shopping Center, Loja 42', geometry: { location: { lat: lat - 0.01, lng: lng - 0.03 } }, rating: 4.7 },
      ]);
      return;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${RAIO_KM}&keyword=sorveteria+gelato&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results) setSorveterias(data.results);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível buscar as sorveterias.');
    }
  };

  const focarNoLocal = (place) => {
    setSelecionada(place);
    mapRef.current?.animateToRegion({
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 800);
  };

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3D1A78" />
        <Text style={styles.loadingText}>Buscando sorveterias próximas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar} style={styles.voltarBtn}>
          <Text style={styles.voltarText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Franquias no Mapa</Text>
        <View style={{ width: 70 }} />
      </View>

      {/* Mapa */}
      {localizacao && (
        <MapView
          ref={mapRef}
          style={styles.mapa}
          initialRegion={{
            latitude: localizacao.latitude,
            longitude: localizacao.longitude,
            latitudeDelta: 0.12,
            longitudeDelta: 0.12,
          }}
          showsUserLocation
          showsMyLocationButton
        >
          {/* Círculo de 10km */}
          <Circle
            center={localizacao}
            radius={RAIO_KM}
            strokeColor="rgba(61,26,120,0.4)"
            fillColor="rgba(61,26,120,0.05)"
            strokeWidth={2}
          />

          {/* Markers das sorveterias */}
          {sorveterias.map((place) => (
            <Marker
              key={place.place_id}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
              pinColor="#FF4D8D"
              onPress={() => setSelecionada(place)}
            />
          ))}
        </MapView>
      )}

      {/* Lista de sorveterias */}
      <View style={styles.lista}>
        <Text style={styles.listaTitulo}>
          {sorveterias.length} franquia{sorveterias.length !== 1 ? 's' : ''} num raio de 10km
        </Text>
        <FlatList
          data={sorveterias}
          keyExtractor={(item) => item.place_id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.cardLoja, selecionada?.place_id === item.place_id && styles.cardLojaSelecionada]}
              onPress={() => focarNoLocal(item)}
            >
              <Text style={styles.cardLojaEmoji}>🍦</Text>
              <Text style={styles.cardLojaNome} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.cardLojaEndereco} numberOfLines={1}>{item.vicinity}</Text>
              {item.rating && (
                <Text style={styles.cardLojaRating}>⭐ {item.rating}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F0FF' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#3D1A78', fontSize: 15, fontWeight: '600' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#3D1A78',
  },
  voltarBtn: { paddingVertical: 6, paddingHorizontal: 4 },
  voltarText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  headerTitulo: { color: '#fff', fontSize: 17, fontWeight: '800' },
  mapa: { flex: 1 },
  lista: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  listaTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3D1A78',
    paddingHorizontal: 16,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardLoja: {
    width: 150,
    backgroundColor: '#F4F0FF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  cardLojaSelecionada: {
    backgroundColor: '#3D1A78',
  },
  cardLojaEmoji: { fontSize: 28, marginBottom: 6 },
  cardLojaNome: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  cardLojaEndereco: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 2,
  },
  cardLojaRating: {
    fontSize: 12,
    color: '#FF9500',
    marginTop: 4,
    fontWeight: '600',
  },
});
