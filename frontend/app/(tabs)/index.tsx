import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Share, SafeAreaView, FlatList, Animated } from 'react-native';
import api from '../../services/api';

export default function HomeScreen() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedPessoa, setSelectedPessoa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animateEntry = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(); // CORRIGIDO: Removido o .current
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Currículo Profissional - ${selectedPessoa?.nome}: https://api-curriculum.vercel.app/api-docs`,
      });
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    api.get('/pessoas')
      .then(res => {
        setProfiles(res.data);
        if (res.data.length > 0) {
          setSelectedPessoa(res.data[0]);
          animateEntry();
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selectProfile = (pessoa: any) => {
    setSelectedPessoa(pessoa);
    animateEntry();
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color="#0047AB" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Selecione um Perfil</Text>
      
      <View style={styles.selectorContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={profiles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => selectProfile(item)}
              style={[styles.profileTab, selectedPessoa?.id === item.id && styles.profileTabActive]}
            >
              <Text style={[styles.profileTabText, selectedPessoa?.id === item.id && styles.profileTabTextActive]}>
                {item.nome.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Animated.ScrollView style={{ opacity: fadeAnim }}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{selectedPessoa?.nome?.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{selectedPessoa?.nome}</Text>
          <Text style={styles.subtitle}>Desenvolvedor Full Stack</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>E-MAIL</Text>
          <Text style={styles.value}>{selectedPessoa?.email}</Text>
          <View style={styles.spacer} />
          <Text style={styles.label}>TELEFONE</Text>
          <Text style={styles.value}>{selectedPessoa?.telefone}</Text>
        </View>

        <TouchableOpacity onPress={onShare} style={styles.shareButton} activeOpacity={0.8}>
          <Text style={styles.shareText}>COMPARTILHAR CURRÍCULO</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 11, fontWeight: '700', color: '#A0AEC0', textAlign: 'center', marginTop: 50, textTransform: 'uppercase', letterSpacing: 1 },
  selectorContainer: { marginVertical: 15, paddingLeft: 20 },
  profileTab: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F7FAFC', marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  profileTabActive: { backgroundColor: '#0047AB', borderColor: '#0047AB' },
  profileTabText: { color: '#718096', fontWeight: '600', fontSize: 13 },
  profileTabTextActive: { color: '#FFFFFF' },
  profileHeader: { alignItems: 'center', paddingVertical: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarLabel: { fontSize: 32, color: '#0047AB', fontWeight: '300' },
  name: { fontSize: 24, fontWeight: '700', color: '#1A202C' },
  subtitle: { fontSize: 13, color: '#718096', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  infoBox: { marginHorizontal: 25, backgroundColor: '#F7FAFC', borderRadius: 12, padding: 20, marginTop: 10 },
  label: { fontSize: 10, color: '#A0AEC0', fontWeight: '700', marginBottom: 4 },
  value: { fontSize: 15, color: '#2D3748' },
  spacer: { height: 15 },
  shareButton: { margin: 25, backgroundColor: '#0047AB', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  shareText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, letterSpacing: 1 }
});