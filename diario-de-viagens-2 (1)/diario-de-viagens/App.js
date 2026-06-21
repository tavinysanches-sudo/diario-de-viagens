import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import TravelForm from './components/TravelForm';
import TravelCard from './components/TravelCard';

let db = null;

async function getDb(){
  if (db === null){
    db = await SQLite.openDatabaseAsync("rn_sqlite");
  }
  return db;
}

export default function App() {
  const [travels, setTravels] = useState([]);
  const [currentTravel, setCurrentTravel] = useState(null);

  const createTable = async () => {
    try {
      const database = await getDb();
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS travels (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          local TEXT,
          cidade TEXT,
          data TEXT,
          avaliacao TEXT,
          comentario TEXT,
          imageUri TEXT
        );
      `);
    } catch (e) {console.error('Erro ao criar tabela', e);}
  };

  const loadTravels = async () => {
    try {
      const database = await getDb();
      const data = await database.getAllAsync('SELECT * FROM travels ORDER BY id DESC');

      setTravels(data);
    } catch (e) {console.error('Erro ao carregar viagens', e);}
  };

   useEffect(() => {
     async function iniciarBanco() {
       await createTable();
       await loadTravels();
     }
     iniciarBanco()
  }, []);

  const handleSave = async (travel) => {
    try {
      const database = await getDb();
      if (travel.id) {
         await database.runAsync(
          `UPDATE travels
           SET local = ?, cidade = ?, data = ?, avaliacao = ?, comentario = ?, imageUri = ?
           WHERE id = ?`,
          [travel.local, travel.cidade, travel.data, travel.avaliacao, travel.comentario, travel.imageUri, travel.id]
        );
      } else {
        await database.runAsync(
          `INSERT INTO travels
          (local, cidade, data, avaliacao, comentario, imageUri)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [travel.local, travel.cidade, travel.data, travel.avaliacao, travel.comentario, travel.imageUri]
        );
      }
      await loadTravels();
      setCurrentTravel(null);
    } catch (e) {console.error('Erro ao salvar', e);}
  };

  const handleDelete = async (id) => {
    Alert.alert('Excluir', 'Tem certeza que deseja excluir esta viagem?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Excluir',style: 'destructive',
          onPress: async () => {
            try {
              const database = await getDb();
              await database.runAsync('DELETE FROM travels WHERE id = ?', [id]);
              await loadTravels();
            } catch (e) {console.error('Erro ao excluir', e);}
          }
        }
      ]
    );
  };

  const startAdd = () => {
    setCurrentTravel({
      local: '',
      cidade: '',
      data: '',
      avaliacao: '',
      comentario: '',
      imageUri: null,
      id: null
    });
  };

  const startEdit = (travel) => {
    setCurrentTravel(travel);
  };

  if (currentTravel !== null) {
    return (
      <SafeAreaView style={styles.container}>
        <TravelForm
          onSave={handleSave}
          onCancel={() => setCurrentTravel(null)}
          initialData={currentTravel}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✈️ TravelLog</Text>
        <Text style={styles.subtitle}>Meu Diário de Viagens</Text>
      </View>

      <FlatList
        data={travels}
        keyExtractor={(item) => item.id.toString()}//keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TravelCard 
            travel={item} 
            onEdit={startEdit} 
            onDelete={handleDelete} 
          />
        )}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.fab} onPress={startAdd}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    color: '#bdc3c7',
    fontSize: 14,
  },
  list: {
    padding: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#e67e22',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
  }
});