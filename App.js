import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as LocalAuthentication  from 'expo-local-authentication';
import { useEffect,useState } from 'react';


export function telasegura(){
  const [access, setAccess] = useState(false);
  
  useEffect(() => {
    (async () => {
      const authentication = await LocalAuthentication.authenticateAsync();
      if (authentication.success)
        setAccess(true)
      
      else
        setAccess(false)
    })();
  }, []);

}

return(
  <View>
    {access &&(
      <Text>Usuário logado com sucesso!</Text>
    )}
  </View>
)

export default function App() {

  const [biometria,setBiometria] = useState(false);
  const [render, setRender] = useState(false);

  const changRender = () =>setRender(true)  

  useEffect(() => {
    (async () => {
      const compativel = await LocalAuthentication.hasHardwareAsync();
      setBiometria(compativel)
    })();
  }, []);

  if(render){
    return <telasegura/>
  } else{
    return(
      <View style={styles.container}>
        <Text>
          {biometria ? 'Biometria disponivel' : 'Biometria não disponivel'}
        </Text>
        <TouchableOpacity onPress={changRender}>
          <Text>Entrar</Text>
        </TouchableOpacity>
        <statusbar style='auto'/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
