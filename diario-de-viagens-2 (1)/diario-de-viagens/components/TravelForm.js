import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function TravelForm({ onSave, onCancel, initialData }) {
  const [local, setLocal] = useState(initialData?.local || '');
  const [cidade, setCidade] = useState(initialData?.cidade || '');
  const [data, setData] = useState(initialData?.data || new Date().toLocaleDateString());
  const [comentario, setComentario] = useState(initialData?.comentario || '');
  const [imageUri, setImageUri] = useState(initialData?.imageUri || null);
  const [avaliacao, setAvaliacao] = useState(initialData?.avaliacao || '');

  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!local || !cidade || !data || !avaliacao) {
      Alert.alert("Atenção", "Preencha o Local, Cidade, Data e Avaliação.");
      return;
    }
    await onSave({
      id: initialData?.id || null,
      local,
      cidade,
      data,
      avaliacao,
      comentario,
      imageUri
    });
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Sem foto</Text>
          </View>
        )}
      </View>

      <View style={styles.hardwareRow}>
        <TouchableOpacity style={[styles.btn, styles.btnCamera]} onPress={takePhoto}>
          <Text style={styles.btnText}>📷 Tirar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Local / Ponto Turístico:</Text>
        <TextInput style={styles.input} value={local} onChangeText={setLocal} placeholder="Ex: Torre Eiffel" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cidade / País:</Text>
        <TextInput style={styles.input} value={cidade} onChangeText={setCidade} placeholder="Ex: Paris, França" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data:</Text>
        <TextInput style={styles.input} value={data} onChangeText={setData} placeholder="DD/MM/AAAA" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Avalie sua experiência:</Text>
        <TextInput style={styles.input} value={avaliacao} onChangeText={setAvaliacao} placeholder="(0 à 5)" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Comentário:</Text>
        <TextInput style={[styles.input, styles.textArea]} value={comentario} onChangeText={setComentario} multiline numberOfLines={4} placeholder="Como foi a experiência?" />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onCancel}>
          <Text style={styles.btnText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleSubmit}>
          <Text style={styles.btnText}>Salvar Viagem</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9e9e9e',
  },
  hardwareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  btn: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  btnCamera: {
    backgroundColor: '#e67e22',
  },
  btnSave: {
    backgroundColor: '#27ae60',
  },
  btnCancel: {
    backgroundColor: '#e74c3c',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
});