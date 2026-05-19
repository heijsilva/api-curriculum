import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import api from '../../services/api';

export default function EducationScreen() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchEducation = () => {
    // Caso sua rota de formações não esteja mapeada, faremos uma requisição limpa
    api.get('/formacoes')
      .then(res => {
        const activeId = (global as any).selectedPessoaId;
        const filtered = activeId 
          ? res.data.filter((item: any) => item.pessoa_id === activeId)
          : res.data;
        setEducations(filtered);
        Loading: setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchEducation();
    }
  }, [isFocused]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="small" color="#0F172A" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Formação Acadêmica</Text>
      <FlatList
        data={educations}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eduCard}>
            <Text style={styles.eduInstitution}>{item.instituicao}</Text>
            <Text style={styles.eduCourse}>{item.curso}</Text>
            <Text style={styles.eduYear}>Conclusão • {item.ano_conclusao}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyState}>Nenhum registro educacional para este profissional.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#0F172A', marginTop: 60, marginBottom: 28, paddingHorizontal: 24 },
  eduCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  eduInstitution: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  eduCourse: { fontSize: 14, fontWeight: '500', color: '#64748B', marginTop: 4 },
  eduYear: { fontSize: 12, color: '#94A3B8', marginTop: 8, fontWeight: '500' },
  emptyState: { textAlign: 'center', marginTop: 60, color: '#94A3B8', fontSize: 14 }
});