<template>
  <v-data-table
      :headers="headers"
      :items="this.users"
      sort-by="name"
      class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
          flat
      >
        <v-toolbar-title>CRUD DE USUARIOS</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
            v-model="dialog"
            max-width="700px"
        >
          <!-- boton agregar usuario-->
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >
              Agregar Usuario
            </v-btn>
          </template>
          <!--fin boton agregar usuario-->

          <!--form-card agregar/editar usuario-->
          <v-form v-model="valid" ref="form">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.rut"
                        label="Rut"
                        :rules="requiredRules"
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.name"
                        label="Nombre"
                        :rules="requiredRules"
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.lastname"
                        label="Apellidos"
                        :rules="requiredRules"
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.city"
                        label="Ciudad"
                        :rules="requiredRules"
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-text-field
                        v-model="editedItem.email"
                        label="Correo Electrónico"
                        :rules="requiredRules"
                        required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
              >
                Cancelar
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
              >
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
          </v-form>
          <!--fin form-card agregar/editar usuarios-->


        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">¿Está seguro de eliminar este registro?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
          small
          @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
          color="primary"
      >
        No hay registro que mostrar
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {db} from '@/firebase/firebase.js'
import {doc, updateDoc, deleteDoc, collection, addDoc} from 'firebase/firestore'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    requiredRules: [(v) => !!v || 'Campo es requerido'],
    valid: true,
    headers: [
      {
        text: 'Rut',
        align: 'center',
        sortable: false,
        value: 'rut',
      },
      {text: 'Nombre', value: 'name'},
      {text: 'Apellidos', value: 'lastname'},
      {text: 'Ciudad', value: 'city'},
      {text: 'Correo Electrónico', value: 'email'},
      {text: 'Acciones', value: 'actions', sortable: false},
    ],

    editedIndex: -1,
    editedItem: {
      rut: '',
      name: '',
      lastname: '',
      city: '',
      email: '',
    },
    defaultItem: {
      rut: '',
      name: '',
      lastname: '',
      city: '',
      email: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Registrar Usuario' : 'Editar Usuario'
    },
    ...mapState(['users'])
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.fetchUsers()
  },

  methods: {
    ...mapActions(['fetchUsers']),

    editItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      try{
        await deleteDoc(doc(db,'users',this.editedItem.id))
      }
      catch(error){
        console.log(error)
      }

      this.users.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      this.$refs.form.validate()//validar campos
      if(!this.valid) return //no es valido y funcion se cierra
      if (this.editedIndex > -1) {
        try {
          let user = this.editedItem
          await updateDoc(doc(db, 'users', user.id), user)

        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          let response = await addDoc(collection(db, 'users'), this.editedItem)
          console.log(response)

        } catch (error) {
          console.log(error)
        }
      }
      await this.fetchUsers()
      this.$refs.form.reset()
      this.close()
    },
  }
}
</script>