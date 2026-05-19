import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import api from '../../services/api';

export default function ExperienceScreen() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/experiencias')
      .then(res => {
        setExperiences(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color="#0047AB" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>Histórico Profissional</Text>
      <FlatList
        data={experiences}
        contentContainerStyle={{ paddingBottom: 30 }}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.dot} />
            <Text style={styles.company}>{item.empresa}</Text>
            <Text style={styles.role}>{item.cargo}</Text>
            <Text style={styles.desc}>{item.descricao}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma experiência registrada.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 25 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainTitle: { fontSize: 24, fontWeight: '700', color: '#1A202C', marginTop: 60, marginBottom: 25 },
  card: { paddingLeft: 20, borderLeftWidth: 1, borderLeftColor: '#E2E8F0', marginLeft: 10, marginBottom: 25 },
  dot: { position: 'absolute', left: -5, top: 0, width: 9, height: 9, borderRadius: 5, backgroundColor: '#0047AB' },
  company: { fontSize: 18, fontWeight: '700', color: '#1A202C' },
  role: { fontSize: 15, fontWeight: '500', color: '#4A5568', marginVertical: 4 },
  desc: { fontSize: 14, color: '#718096', lineHeight: 22 },
  empty: { textAlign: 'center', marginTop: 50, color: '#A0AEC0' }
});