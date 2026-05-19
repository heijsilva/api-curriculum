import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import api from '../../services/api';

export default function ExperienceScreen() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused(); // hook para atualizar a tela ao entrar nela

  const fetchExperiences = () => {
    api.get('/experiencias')
      .then(res => {
        // Filtra para exibir apenas as experiências da pessoa selecionada na Home
        const activeId = (global as any).selectedPessoaId;
        const filtered = activeId 
          ? res.data.filter((item: any) => item.pessoa_id === activeId)
          : res.data;
        setExperiences(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchExperiences();
    }
  }, [isFocused]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="small" color="#0F172A" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Trajetória de Carreira</Text>
      <FlatList
        data={experiences}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.timelineItem}>
            <View style={styles.timelineTrack}>
              <View style={styles.timelineDot} />
            </View>
            <View style={styles.contentBlock}>
              <Text style={styles.companyName}>{item.empresa}</Text>
              <Text style={styles.roleTitle}>{item.cargo}</Text>
              <Text style={styles.descriptionText}>{item.descricao}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyState}>Nenhuma experiência cadastrada para este profissional.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#0F172A', marginTop: 60, marginBottom: 28, paddingHorizontal: 24 },
  timelineItem: { flexDirection: 'row', marginBottom: 24 },
  timelineTrack: { width: 24, alignItems: 'center' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0F172A', marginTop: 6 },
  contentBlock: { flex: 1, paddingLeft: 12 },
  companyName: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  roleTitle: { fontSize: 14, fontWeight: '600', color: '#64748B', marginVertical: 4 },
  descriptionText: { fontSize: 13, color: '#334155', lineHeight: 20 },
  emptyState: { textAlign: 'center', marginTop: 60, color: '#94A3B8', fontSize: 14 }
});