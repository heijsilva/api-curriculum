import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Share, SafeAreaView, FlatList, Animated } from 'react-native';
import api from '../../services/api';

declare global {
  var selectedPessoaId: number;
}

export default function HomeScreen() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedPessoa, setSelectedPessoa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animateEntry = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Currículo Profissional de ${selectedPessoa?.nome}: https://api-curriculum.vercel.app/api-docs`,
      });
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    api.get('/pessoas')
      .then(res => {
        setProfiles(res.data);
        if (res.data.length > 0) {
          // Tenta colocar o Victor Oliveira como primeiro se achar na lista, senão bota o primeiro
          const victor = res.data.find((p: any) => p.nome.toLowerCase().includes('victor'));
          const defaultAc = victor || res.data[0];
          setSelectedPessoa(defaultAc);
          global.selectedPessoaId = defaultAc.id; // Seta variável global simples
          animateEntry();
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selectProfile = (pessoa: any) => {
    setSelectedPessoa(pessoa);
    global.selectedPessoaId = pessoa.id; // Atualiza ID ativo
    animateEntry();
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="small" color="#0F172A" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionHeader}>Profissionais Disponíveis</Text>
      
      <View style={styles.selectorWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={profiles}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          renderItem={({ item }) => {
            const isSelected = selectedPessoa?.id === item.id;
            return (
              <TouchableOpacity 
                onPress={() => selectProfile(item)}
                style={[styles.pillButton, isSelected && styles.pillButtonActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                  {item.nome.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <Animated.ScrollView style={{ opacity: fadeAnim }} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLetter}>{selectedPessoa?.nome?.charAt(0)}</Text>
          </View>
          <Text style={styles.fullname}>{selectedPessoa?.nome}</Text>
          <Text style={styles.headline}>Tecnologia & Dados</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.infoBlock}>
            <Text style={styles.detailLabel}>Email Profissional</Text>
            <Text style={styles.detailValue}>{selectedPessoa?.email}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoBlock}>
            <Text style={styles.detailLabel}>Contato Direto</Text>
            <Text style={styles.detailValue}>{selectedPessoa?.telefone}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoBlock}>
            <Text style={styles.detailLabel}>Localidade</Text>
            <Text style={styles.detailValue}>{selectedPessoa?.id === 3 || selectedPessoa?.nome.includes('Victor') ? 'Recife - PE' : 'São Paulo, Brasil'}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onShare} style={styles.actionButton} activeOpacity={0.9}>
          <Text style={styles.actionButtonText}>COMPARTILHAR PERFIL</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textAlign: 'center', marginTop: 50, textTransform: 'uppercase', letterSpacing: 1.5 },
  selectorWrapper: { marginVertical: 16, height: 44 },
  pillButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 99, backgroundColor: '#F1F5F9', marginRight: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  pillButtonActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  pillText: { color: '#64748B', fontWeight: '600', fontSize: 13 },
  pillTextActive: { color: '#FFFFFF' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  profileSection: { alignItems: 'center', paddingVertical: 20 },
  avatarLarge: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarLetter: { fontSize: 36, color: '#0F172A', fontWeight: '300' },
  fullname: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  headline: { fontSize: 13, color: '#64748B', fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 },
  detailsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  infoBlock: { paddingVertical: 2 },
  detailLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  detailValue: { fontSize: 15, color: '#334155', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  actionButton: { backgroundColor: '#0F172A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  actionButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, letterSpacing: 1 }
});