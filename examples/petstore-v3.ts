// Auto-generated by https://github.com/vladkens/apigen-ts
// Source: https://petstore3.swagger.io/api/v3/openapi.json

interface ApigenConfig {
  baseUrl: string
  headers: Record<string, string>
}

interface ApigenRequest extends Omit<RequestInit, "body"> {
  search?: Record<string, unknown>
  body?: unknown
}

export class ApiClient {
  ISO_FORMAT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/
  Config: ApigenConfig

  constructor(config?: Partial<ApigenConfig>) {
    this.Config = { baseUrl: "/", headers: {}, ...config }
  }

  PopulateDates<T>(d: T): T {
    if (d === null || d === undefined || typeof d !== "object") return d

    const t = d as unknown as Record<string, unknown>
    for (const [k, v] of Object.entries(t)) {
      if (typeof v === "string" && this.ISO_FORMAT.test(v)) t[k] = new Date(v)
      else if (typeof v === "object") this.PopulateDates(v)
    }

    return d
  }

  async ParseError(rep: Response) {
    try {
      return await rep.json()
    } catch (e) {
      throw rep
    }
  }

  async Fetch<T>(method: string, path: string, opts: ApigenRequest = {}): Promise<T> {
    let base = this.Config.baseUrl
    if (globalThis.location && (base === "" || base.startsWith("/"))) {
      base = `${globalThis.location.origin}${base.endsWith("/") ? base : `/${base}`}`
    }

    const url = new URL(path, base)
    for (const [k, v] of Object.entries(opts?.search ?? {})) {
      url.searchParams.append(k, Array.isArray(v) ? v.join(",") : (v as string))
    }

    const headers = new Headers({ ...this.Config.headers, ...opts.headers })
    const ct = headers.get("content-type") ?? "application/json"

    let body: FormData | URLSearchParams | string | undefined = undefined

    if (ct === "multipart/form-data" || ct === "application/x-www-form-urlencoded") {
      headers.delete("content-type")
      body = ct === "multipart/form-data" ? new FormData() : new URLSearchParams()
      for (const [k, v] of Object.entries(opts.body as Record<string, string>)) {
        body.append(k, v)
      }
    }

    if (ct === "application/json" && typeof opts.body !== "string") {
      headers.set("content-type", "application/json")
      body = JSON.stringify(opts.body)
    }

    const credentials = opts.credentials ?? "include"
    const rep = await fetch(url.toString(), { method, ...opts, headers, body, credentials })
    if (!rep.ok) throw await this.ParseError(rep)

    const rs = await rep.text()
    try {
      return this.PopulateDates(JSON.parse(rs))
    } catch (e) {
      return rs as unknown as T
    }
  }

  pet = {
    addPet: (body: Pet) => {
      return this.Fetch<Pet>("post", "/pet", { body })
    },

    updatePet: (body: Pet) => {
      return this.Fetch<Pet>("put", "/pet", { body })
    },

    findPetsByStatus: (search: { status?: "available" | "pending" | "sold" }) => {
      return this.Fetch<Pet[]>("get", "/pet/findByStatus", { search })
    },

    findPetsByTags: (search: { tags?: string[] }) => {
      return this.Fetch<Pet[]>("get", "/pet/findByTags", { search })
    },

    getPetById: (petId: number) => {
      return this.Fetch<Pet>("get", `/pet/${petId}`, {})
    },

    updatePetWithForm: (
      petId: number,
      search: {
        name?: string
        status?: string
      },
    ) => {
      return this.Fetch<void>("post", `/pet/${petId}`, { search })
    },

    deletePet: (petId: number) => {
      return this.Fetch<void>("delete", `/pet/${petId}`, {})
    },

    uploadFile: (
      petId: number,
      search: {
        additionalMetadata?: string
      },
    ) => {
      return this.Fetch<ApiResponse>("post", `/pet/${petId}/uploadImage`, { search })
    },
  }

  store = {
    getInventory: () => {
      return this.Fetch<object>("get", "/store/inventory", {})
    },

    placeOrder: (body: Order) => {
      return this.Fetch<Order>("post", "/store/order", { body })
    },

    getOrderById: (orderId: number) => {
      return this.Fetch<Order>("get", `/store/order/${orderId}`, {})
    },

    deleteOrder: (orderId: number) => {
      return this.Fetch<void>("delete", `/store/order/${orderId}`, {})
    },
  }

  user = {
    createUser: (body: User) => {
      return this.Fetch<void>("post", "/user", { body })
    },

    createUsersWithListInput: (body: User[]) => {
      return this.Fetch<User>("post", "/user/createWithList", { body })
    },

    loginUser: (search: { username?: string; password?: string }) => {
      return this.Fetch<string>("get", "/user/login", { search })
    },

    logoutUser: () => {
      return this.Fetch<void>("get", "/user/logout", {})
    },

    getUserByName: (username: string) => {
      return this.Fetch<User>("get", `/user/${username}`, {})
    },

    updateUser: (username: string, body: User) => {
      return this.Fetch<void>("put", `/user/${username}`, { body })
    },

    deleteUser: (username: string) => {
      return this.Fetch<void>("delete", `/user/${username}`, {})
    },
  }
}

export type Address = {
  street?: string
  city?: string
  state?: string
  zip?: string
}

export type ApiResponse = {
  code?: number
  type?: string
  message?: string
}

export type Category = {
  id?: number
  name?: string
}

export type Customer = {
  id?: number
  username?: string
  address?: Address[]
}

export type Order = {
  id?: number
  petId?: number
  quantity?: number
  shipDate?: Date
  status?: "placed" | "approved" | "delivered"
  complete?: boolean
}

export type Pet = {
  id?: number
  name: string
  category?: Category
  photoUrls: string[]
  tags?: Tag[]
  status?: "available" | "pending" | "sold"
}

export type Tag = {
  id?: number
  name?: string
}

export type User = {
  id?: number
  username?: string
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  phone?: string
  userStatus?: number
}
