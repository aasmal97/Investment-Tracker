import { createSlice } from '@reduxjs/toolkit'

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: {
        first_name: "Arky",
        last_name: "Asmal",
        email: "arkyasmal@gmail.com",
        password: "Pizzaandfries97",
        verified_email: true,
        remember_me: false,
        investments_tracked: ["hi", "bye", "no", "cool", "nice"],
        current_value_invested: {
            "hi": 1, 
            "bye": 2, 
            "no": 3, 
            "cool": 4, 
            "nice": 5
        },
        contact_settings:{

        }
    },
    reducers: {
        updated: (state, action) => {
            state[action.payload[0]] = action.payload[1]
        }
    },
})

// Action creators are generated for each case reducer function
export const { updated } = userInfoSlice.actions

export default userInfoSlice.reducer