import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, FlatList, SafeAreaView, TextInput,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const RAIO_KM = 10000;

export default function MapScreen({ lojas = [] }) {
  const [localizacao, setLocalizacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [selecionada, setSelecionada] = useState(null);
  const [busca, setBusca] = useState('');
  const [pertoDeMin, setPertoDeMin] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    iniciar();
  }, []);

  const iniciar = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCarregando(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocalizacao({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível obter sua localização.');
    } finally {
      setCarregando(false);
    }
  };

  const distancia = (loja) => {
    if (!localizacao || !loja.lat || !loja.lng) return Infinity;
    const dLat = loja.lat - localizacao.latitude;
    const dLng = loja.lng - localizacao.longitude;
    return Math.sqrt(dLat * dLat + dLng * dLng);
  };

  let listaFiltrada = lojas.filter((l) =>
    (l.nome + ' ' + (l.cidade || '') + ' ' + (l.endereco || ''))
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  if (pertoDeMin) {
    listaFiltrada = [...listaFiltrada].sort((a, b) => distancia(a) - distancia(b));
  }

  const focarNoLocal = (loja) => {
    setSelecionada(loja.id);
    if (loja.lat && loja.lng) {
      mapRef.current?.animateToRegion({
        latitude: loja.lat,
        longitude: loja.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 800);
    }
  };

  const lojasSemLocalizacao = lojas.filter((l) => !l.lat || !l.lng);
  const marcadores = localizacao
    ? lojas.filter((l) => l.lat && l.lng)
    : [];

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3D1A78" />
        <Text style={styles.loadingText}>Obtendo localização...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appbar}>
        <Text style={styles.appbarTitle}>Franquias no Mapa</Text>
      </View>

      {/* Mapa */}
      <View style={styles.mapaContainer}>
        {localizacao ? (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: localizacao.latitude,
              longitude: localizacao.longitude,
              latitudeDelta: 0.12,
              longitudeDelta: 0.12,
            }}
            showsUserLocation
          >
            <Circle
              center={localizacao}
              radius={RAIO_KM}
              strokeColor="rgba(61,26,120,0.4)"
              fillColor="rgba(61,26,120,0.07)"
              strokeWidth={2}
            />
            {marcadores.map((l) => (
              <Marker
                key={l.id}
                coordinate={{ latitude: l.lat, longitude: l.lng }}
                title={l.nome}
                description={l.endereco}
                pinColor="#FF4D8D"
                onPress={() => setSelecionada(l.id)}
              />
            ))}
          </MapView>
        ) : (
          <View style={styles.semLocalizacao}>
            <Text style={styles.semLocalizacaoTexto}>📍 Permita o acesso à localização para ver o mapa</Text>
          </View>
        )}

        {/* Search + perto de mim flutuante sobre o mapa */}
        <View style={styles.buscaFlutuante}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={19} color="#9090A0" />
            <TextInput
              testID="input-busca-mapa"
              style={styles.searchInput}
              placeholder="Pesquisar franquia..."
              placeholderTextColor="#9090A0"
              value={busca}
              onChangeText={setBusca}
            />
          </View>
          <TouchableOpacity
            testID="btn-perto-mim"
            style={[styles.pertoBtn, pertoDeMin && styles.pertoBtnAtivo]}
            onPress={() => setPertoDeMin((v) => !v)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="locate-outline"
              size={22}
              color={pertoDeMin ? '#fff' : '#3D1A78'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de franquias */}
      <View style={styles.lista}>
        <Text style={styles.listaTitulo}>
          {pertoDeMin ? 'Ordenadas por proximidade' : `${listaFiltrada.length} franquia${listaFiltrada.length !== 1 ? 's' : ''} num raio de 10km`}
        </Text>
        {listaFiltrada.length === 0 ? (
          <Text style={styles.semResultado}>Nenhuma franquia encontrada</Text>
        ) : (
          <FlatList
            data={listaFiltrada}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listaContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.cardLoja, selecionada === item.id && styles.cardLojaSelecionada]}
                onPress={() => focarNoLocal(item)}
                activeOpacity={0.85}
              >
                <Text style={styles.cardLojaNome} numberOfLines={1}>{item.nome}</Text>
                <Text style={[styles.cardLojaEndereco, selecionada === item.id && { color: 'rgba(255,255,255,0.8)' }]} numberOfLines={1}>
                  {item.endereco}
                </Text>
                <Text style={[styles.cardLojaCidade, selecionada === item.id && { color: 'rgba(255,255,255,0.7)' }]} numberOfLines={1}>
                  {item.cidade}
                </Text>
                {item.nota && (
                  <View style={styles.cardLojaRating}>
                    <Ionicons name="star" size={14} color="#E8A100" />
                    <Text style={styles.cardLojaRatingText}>{item.nota}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3D1A78' },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F4F0FF',
  },
  loadingText: { color: '#3D1A78', fontSize: 15, fontWeight: '600' },
  appbar: {
    backgroundColor: '#3D1A78',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  appbarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  mapaContainer: {
    height: 340,
    position: 'relative',
    backgroundColor: '#dDEbe0',
  },
  semLocalizacao: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f0ea',
  },
  semLocalizacaoTexto: {
    fontSize: 14,
    color: '#555566',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  buscaFlutuante: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    gap: 10,
    zIndex: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    padding: 0,
  },
  pertoBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  pertoBtnAtivo: {
    backgroundColor: '#FF4D8D',
  },
  lista: {
    flex: 1,
    backgroundColor: '#F4F0FF',
    paddingTop: 14,
    paddingBottom: 8,
  },
  listaTitulo: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3D1A78',
    paddingHorizontal: 16,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.85,
  },
  semResultado: {
    textAlign: 'center',
    color: '#9090A0',
    fontWeight: '700',
    paddingVertical: 16,
  },
  listaContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  cardLoja: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  cardLojaSelecionada: {
    backgroundColor: '#3D1A78',
    borderColor: '#FF4D8D',
  },
  cardLojaNome: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 3,
  },
  cardLojaEndereco: {
    fontSize: 13,
    color: '#555566',
    fontWeight: '600',
  },
  cardLojaCidade: {
    fontSize: 13,
    color: '#555566',
    fontWeight: '600',
    marginBottom: 8,
  },
  cardLojaRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLojaRatingText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E8A100',
  },
});
