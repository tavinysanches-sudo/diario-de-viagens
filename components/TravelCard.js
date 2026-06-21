import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

export default function TravelCard({ travel, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      {travel.imageUri ? (
        <Image source={{ uri: travel.imageUri }} style={styles.image} />
      ) : null}
      
      <View style={styles.content}>
        <Text style={styles.local}>{travel.local}</Text>
        <Text style={styles.cidade}>📍 {travel.cidade}</Text>
        <Text style={styles.data}>📅 {travel.data}</Text>
        <Text style={styles.comentario}>⭐{travel.avaliacao}</Text>
        
        {travel.comentario ? (
          <Text style={styles.comentario}>{travel.comentario}</Text>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(travel)}>
            <Text>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDelete} onPress={() => onDelete(travel.id)}>
            <Text style={styles.btnDelete}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 15,
  },
  local: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  cidade: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  data: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 10,
  },
  comentario: {
    fontSize: 14,
    color: '#34495e',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    gap: 20,
  },
  btnDelete: {
    color: '#ff0000'
  }
})