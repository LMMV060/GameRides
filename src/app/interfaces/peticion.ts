export interface Peticion {
  id:string,
  uid:string,
  url:string,
  nombre:string,
  fecha:string,
  precio:number,
  descripcion:string,
  evento?: string,
  email:any,
  tituloAlternativo?:string,
  descripcionAlternativa?:string
}
