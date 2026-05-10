import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TitleScreen } from '../screens/TitleScreen';
import { NewGameScreen } from '../screens/NewGameScreen';
import { StarterSelectScreen } from '../screens/StarterSelectScreen';
import { WorldMapScreen } from '../screens/WorldMapScreen';
import { BattleScreen } from '../screens/BattleScreen';
import { TeamScreen } from '../screens/TeamScreen';
import { DinopediaScreen } from '../screens/DinopediaScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { DinoLabScreen } from '../screens/DinoLabScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { PlayWithDinoScreen } from '../screens/PlayWithDinoScreen';
import { MultiplayerLobbyScreen } from '../screens/MultiplayerLobbyScreen';
import { RoomScreen } from '../screens/RoomScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type RootStackParamList = {
  Title: undefined;
  NewGame: undefined;
  StarterSelect: undefined;
  WorldMap: undefined;
  Battle: undefined;
  Team: undefined;
  Dinopedia: undefined;
  Inventory: undefined;
  DinoLab: undefined;
  Training: undefined;
  PlayWithDino: undefined;
  MultiplayerLobby: undefined;
  Room: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Title" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Title" component={TitleScreen} />
        <Stack.Screen name="NewGame" component={NewGameScreen} />
        <Stack.Screen name="StarterSelect" component={StarterSelectScreen} />
        <Stack.Screen name="WorldMap" component={WorldMapScreen} />
        <Stack.Screen name="Battle" component={BattleScreen} />
        <Stack.Screen name="Team" component={TeamScreen} />
        <Stack.Screen name="Dinopedia" component={DinopediaScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="DinoLab" component={DinoLabScreen} />
        <Stack.Screen name="Training" component={TrainingScreen} />
        <Stack.Screen name="PlayWithDino" component={PlayWithDinoScreen} />
        <Stack.Screen name="MultiplayerLobby" component={MultiplayerLobbyScreen} />
        <Stack.Screen name="Room" component={RoomScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
