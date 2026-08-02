export type Daerah = {
  slug: string;
  nama: string;
  jumlah: number;
};

export const daerahList: Daerah[] = [
  { slug: "jawa", nama: "Jawa", jumlah: 328 },
  { slug: "sunda", nama: "Sunda", jumlah: 214 },
  { slug: "minang", nama: "Minang", jumlah: 156 },
  { slug: "batak", nama: "Batak", jumlah: 102 },
  { slug: "bali", nama: "Bali", jumlah: 93 },
  { slug: "madura", nama: "Madura", jumlah: 87 },
  { slug: "bugis", nama: "Bugis", jumlah: 74 },
  { slug: "banjar", nama: "Banjar", jumlah: 61 },
  { slug: "aceh", nama: "Aceh", jumlah: 58 },
  { slug: "sasak", nama: "Sasak", jumlah: 32 },
  { slug: "dayak", nama: "Dayak", jumlah: 27 },
  { slug: "papua", nama: "Papua", jumlah: 18 },
];

export const kategoriList = [
  "kata benda",
  "kata kerja",
  "ekspresi",
  "peribahasa",
  "lainnya",
] as const;

export type Kategori = (typeof kategoriList)[number];
