// ADAPTAR PARA O PROJETO

// 'use client';
// import React from 'react';
// import { getUsersByPage } from '@/app/ApiStructure';
// import { UserContext } from '@/app/contexts/UserContext';
// import styles from '@/app/css/pages/Admin.module.css';
// import { updateUser } from '@/app/ApiStructure';
// import { toast } from 'react-toastify';

// const Page = () => {
//   const [users, setUsers] = React.useState([]);
//   const [originalUsers, setOriginalUsers] = React.useState([]);
//   const [totalUsers, setTotalUsers] = React.useState(0);

//   const [page, setPage] = React.useState(1);
//   const [limit, setLimit] = React.useState(10);
//   const { getCookie } = React.useContext(UserContext);
//   const token = getCookie('token');

//   // Função para obter os usuários
//   async function getUsers(page, limit) {
//     try {
//       const { url, options } = getUsersByPage(page, limit, token);
//       const response = await fetch(url, options);
//       const json = await response.json();
//       if (!json.success) {
//         throw new Error(json.message);
//       }
//       setUsers(json.users.users);
//       setTotalUsers(json.users.totalItems);
//       // Faça uma cópia profunda dos dados originais
//       setOriginalUsers(JSON.parse(JSON.stringify(json.users.users)));
//     } catch (error) {
//       console.error(error);
//       toast.error('Erro ao buscar usuários!');
//     }
//   }

//   // useEffect que é acionado quando 'page' ou 'limit' mudam
//   React.useEffect(() => {
//     getUsers(page, limit);
//   }, [page, limit, token]);

//   // Calcula o total de páginas
//   const totalPages = Math.ceil(totalUsers / limit);

//   // Atualiza 'page' caso ultrapasse o número total de páginas
//   React.useEffect(() => {
//     if (page > totalPages && totalPages > 0) {
//       setPage(totalPages);
//     }
//   }, [totalUsers, limit]);

//   function updateData(userId, field, newValue) {
//     setUsers(
//       users.map((user) =>
//         user.id === userId ? { ...user, [field]: newValue } : user,
//       ),
//     );
//   }

//   async function updateUsers(userId) {
//     const toUpdateUser = users.find((u) => u.id === userId);
//     const originalUser = originalUsers.find((u) => u.id === userId);

//     const changedFields = {};
//     for (const key in toUpdateUser) {
//       if (toUpdateUser[key] !== originalUser[key]) {
//         changedFields[key] = toUpdateUser[key];
//       }
//     }

//     // Verifique se há campos para atualizar
//     if (Object.keys(changedFields).length === 0) {
//       return;
//     }

//     try {
//       const { url, options } = updateUser(userId, changedFields, token);
//       const response = await fetch(url, options);
//       const json = await response.json();
//       if (!json.success) {
//         throw new Error(json.message);
//       }
//       // Atualize os dados originais com os novos valores
//       setOriginalUsers((prevOriginalUsers) =>
//         prevOriginalUsers.map((u) =>
//           u.id === userId ? { ...u, ...changedFields } : u,
//         ),
//       );

//       toast.success('Usuário atualizado com sucesso!');
//     } catch (error) {
//       console.error(error);
//       toast.error('Erro ao atualizar usuário!');
//     }
//   }

//   return (
//     <section className={styles.adminPage}>
//       <h2>Administração de usuários</h2>

//       {/* Controles de limite de itens por página */}
//       <div>
//         <label>
//           Itens por página:
//           <select
//             value={limit}
//             onChange={(e) => {
//               setLimit(Number(e.target.value));
//               setPage(1);
//             }}
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={20}>20</option>
//             <option value={50}>50</option>
//             <option value={100}>100</option>
//           </select>
//         </label>
//       </div>

//       {/* Controles de paginação */}
//       <div>
//         <button disabled={page === 1} onClick={() => setPage(page - 1)}>
//           Anterior
//         </button>
//         <span className={styles["paginacao-usuarios"]}>
//           Página {page} de {totalPages}
//         </span>
//         <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
//           Próxima
//         </button>
//       </div>

//       <div className={styles["usuarios-cadastrados"]}>Total de usuários cadastrados: {totalUsers}</div>

//       {users && (
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Nome</th>
//               <th>Email</th>
//               <th>Password</th>
//               <th>Role</th>
//               <th>Acionar</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => {
//               const originalUser = originalUsers.find((u) => u.id === user.id);
//               const hasChanges = originalUser
//                 ? Object.keys(user).some(
//                     (key) => user[key] !== originalUser[key],
//                   )
//                 : false;

//               return (
//                 <tr key={`user-${user.id}`}>
//                   <td>
//                     <input type="text" disabled value={user.id} />
//                   </td>
//                   <td>
//                     <input
//                       onChange={(event) =>
//                         updateData(user.id, 'name', event.target.value)
//                       }
//                       type="text"
//                       value={user.name}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       onChange={(event) =>
//                         updateData(user.id, 'email', event.target.value)
//                       }
//                       type="text"
//                       value={user.email}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       onChange={(event) =>
//                         updateData(user.id, 'password', event.target.value)
//                       }
//                       type="text"
//                       placeholder="*******"
//                       value={user.password}
//                     />
//                   </td>
//                   <td>
//                     <select
//                       value={user.role}
//                       className={`select ${
//                         user.role === 'admin'
//                           ? styles.adminRole
//                           : user.role === 'professor'
//                           ? styles.professorRole
//                           : styles.studentRole
//                       }`}
//                       onChange={(event) =>
//                         updateData(user.id, 'role', event.target.value)
//                       }
//                     >
//                       <option value="student">Student</option>
//                       <option value="professor">Professor</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                   </td>
//                   <td>
//                     <button
//                       onClick={() => updateUsers(user.id)}
//                       disabled={!hasChanges}
//                     >
//                       Atualizar
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//     </section>
//   );
// };

// export default Page;
