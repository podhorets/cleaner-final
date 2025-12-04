import { Migration } from "../types";
import { migration as migration001 } from "./001_initial_schema";

export const migrations: Migration[] = [migration001];

