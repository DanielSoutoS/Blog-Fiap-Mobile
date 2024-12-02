import React from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { GlobalContext } from '@/app/contexts/GlobalContext';
import { getUsersByPage, updateUser } from '@/app/ApiStructure';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';

interface User {
  active: boolean;
  createdAt: string;
  email: string;
  id: number;
  name: string;
  updatedAt: string;
  role: string;
  password?: string;
}

const UsersTable = ({
  users,
  originalUsers,
  updateData,
  updateUsers,
}: {
  users: User[];
  originalUsers: User[];
  updateData: (userId: number, field: string, newValue: string) => void;
  updateUsers: (userId: number) => void;
}) => {
  const roles = ['Student', 'Professor', 'Admin'];

  return (
    <ScrollView style={tableStyles.table}>
      {users.map((user) => {
        const originalUser = originalUsers.find((u) => u.id === user.id);
        const hasChanges = originalUser
          ? (Object.keys(user) as (keyof User)[]).some(
              (key) => user[key] !== originalUser[key],
            )
          : false;

        return (
          <View key={`user-${user.id}`} style={tableStyles.container}>
            <TextInput
              style={[tableStyles.input, tableStyles.disabledInput]}
              placeholder="Id"
              value={user.id.toString()}
              editable={false}
            />
            <TextInput
              style={[tableStyles.input]}
              placeholder="Name"
              value={user.name}
              onChangeText={(text) => updateData(user.id, 'name', text)}
            />
            <TextInput
              style={[tableStyles.input]}
              placeholder="Email"
              value={user.email}
              onChangeText={(text) => updateData(user.id, 'email', text)}
            />
            <TextInput
              style={[tableStyles.input]}
              placeholder="********"
              onChangeText={(text) => updateData(user.id, 'password', text)}
            />
            <View style={tableStyles.radioButtonsDiv}>
              {roles.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    tableStyles.radioButton,
                    user.role === r.toLocaleLowerCase() &&
                      tableStyles.selectedRadioButton,
                  ]}
                  onPress={
                    user.role === r.toLocaleLowerCase()
                      ? () => {}
                      : () => updateData(user.id, 'role', r.toLocaleLowerCase())
                  }
                >
                  <Text style={tableStyles.radioButtonText}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => updateUsers(user.id)}
              disabled={!hasChanges}
            >
              <Text
                style={[
                  tableStyles.updateButton,
                  !hasChanges && {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    backgroundColor: 'gray',
                  },
                ]}
              >
                Update
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default function Admin() {
  const { getCookie } = React.useContext(GlobalContext);
  const [users, setUsers] = React.useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = React.useState<User[]>([]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [page, setPage] = React.useState(1);

  async function getUsers() {
    try {
      const token = await getCookie('token');

      if (!token) {
        return;
      }

      const { url, options } = getUsersByPage(page, 10, token);
      const response = await fetch(url, options);
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.message);
      }

      setUsers(json.users.users);
      setTotalUsers(json.users.totalItems);
      setOriginalUsers(JSON.parse(JSON.stringify(json.users.users)));
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    getUsers();
  }, [page]);

  // Calcula o total de páginas
  const totalPages = Math.ceil(totalUsers / 10);

  // Atualiza 'page' caso ultrapasse o número total de páginas
  React.useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalUsers, 10]);

  function updateData(userId: number, field: string, newValue: string) {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, [field]: newValue } : user,
      ),
    );
  }

  async function updateUsers(userId: number) {
    const toUpdateUser = users.find((u) => u.id === userId);
    const originalUser = originalUsers.find((u) => u.id === userId);

    if (!toUpdateUser || !originalUser) {
      console.error('Usuário não encontrado.');
      return;
    }

    const changedFields: { [key: string]: any } = {};

    for (const key of Object.keys(toUpdateUser) as (keyof User)[]) {
      const newValue = toUpdateUser[key];
      const oldValue = originalUser[key];

      if (newValue !== oldValue) {
        changedFields[key] = newValue as User[keyof User]; // Coerção explícita
      }
    }

    // Verifique se há campos para atualizar
    if (Object.keys(changedFields).length === 0) {
      return;
    }

    try {
      const token = await getCookie('token');
      const { url, options } = updateUser(userId, changedFields, token);
      const response = await fetch(url, options);
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.message);
      }
      // Atualize os dados originais com os novos valores
      setOriginalUsers((prevOriginalUsers) =>
        prevOriginalUsers.map((u) =>
          u.id === userId ? { ...u, ...changedFields } : u,
        ),
      );

      console.log('Usuário atualizado com sucesso!');

      Alert.alert('Usuário atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      console.log('Erro ao atualizar usuário!');
      Alert.alert('Erro ao atualizar usuário!');
    }
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Text style={styles.text}>Administração de usuários</Text>
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navigationButton, page <= 1 && { opacity: 0.5 }]}
            disabled={page <= 1}
            onPress={() => {
              if (page > 1) setPage(page - 1);
            }}
          >
            <Text style={[styles.buttonText, page === 1 && { opacity: 0.5 }]}>
              {' '}
              Anterior
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 16 }}>
            Página {page} de {totalPages}
          </Text>
          <TouchableOpacity
            style={[
              styles.navigationButton,
              page === totalPages && { opacity: 0.5 },
            ]}
            disabled={page === totalPages}
            onPress={() => {
              if (page < totalPages) setPage(page + 1);
            }}
          >
            <Text
              style={[
                styles.buttonText,
                page === totalPages && { opacity: 0.5 },
              ]}
            >
              Próxima
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 16, marginTop: 20 }}>
          Total de usuários cadastrados: {totalUsers}
        </Text>

        <UsersTable
          users={users}
          originalUsers={originalUsers}
          updateData={updateData}
          updateUsers={updateUsers}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  text: {
    color: '#307c4b',
    fontWeight: 'bold',
    fontSize: 24,
  },
  navigationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '70%',
    marginTop: 20,
  },
  navigationButton: {
    backgroundColor: '#2f855a', // Verde escuro
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
  },
});

const tableStyles = StyleSheet.create({
  table: {
    width: '100%',
    display: 'flex',
  },
  container: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  disabledInput: {
    backgroundColor: '#cccccc',
  },
  radioButtonsDiv: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  radioButton: {
    backgroundColor: '#a8d3b7',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  selectedRadioButton: {
    backgroundColor: '#307c4b',
    cursor: 'default',
  },
  updateButton: {
    backgroundColor: '#a8d3b7',
    width: '30%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    color: '#fff',
    cursor: 'pointer',
    marginTop: 20,
  },
});
