import { DataFilterFields } from "./filter";

export type PersonTag
  = "a1" | "a2" | "a3" | "a4"
  | "b1" | "b2" | "b3" | "b4"
  | "c1" | "c2" | "c3" | "c4";

export interface Person {
  id: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  age: number;
  city: "Moscow" | "Saint Petersburg" | "Madrid" | "London" | "Prague" | "Berlin" | "Brussels" | "Paris";
  state: string;
  registeredAt: string;
  color: "#FF5959" | "#AF81C9" | "#F2CA85" | "#54D1F1" | "#7C71AD" | "#445569" | "#003A6F" | "#F89A7E";
  fruit: "Apple" | "Banana" | "Mango" | "Orange" | "Strawberry";
  os: "Linux" | "Windows" | "OS X";
  mobile: "Android" | "iOS" | "Blackberry";
  tags: PersonTag[]
}

export interface PersonMap extends Person {
  [key: string]: any;
}
