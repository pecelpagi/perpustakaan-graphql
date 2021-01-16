import { getToken } from "../../utils";

const isAuthenticated = (getToken() && getToken().length > 0);
const menuData = () => {
  if (!isAuthenticated) {
    return [
      {
        id: "2",
        title: "Koleksi Pustaka",
        icon: "fa fa-book",
        children: [
          {
            id: "2.1",
            title: "Lihat Koleksi",
            link: "/books",
          },
          {
            id: "2.3",
            title: "Daftar Kategori",
            link: "/categories",
          },
        ],
      },
    ];
  }

  return [
    {
      id: "2",
      title: "Koleksi Pustaka",
      icon: "fa fa-book",
      children: [
        {
          id: "2.1",
          title: "Lihat Koleksi",
          link: "/books",
        },
        {
          id: "2.2",
          title: "Tambah Koleksi",
          link: "/book/create",
        },
        {
          id: "2.3",
          title: "Daftar Kategori",
          link: "/categories",
        },
        {
          id: "2.4",
          title: "Tambah Kategori",
          link: "/category/create",
        },
      ],
    },
    {
      id: "3",
      title: "Peminjaman",
      icon: "fa fa-calendar",
      children: [
        {
          id: "3.1",
          title: "Status Peminjaman",
          link: "/peminjaman-list",
        },
        {
          id: "3.2",
          title: "Peminjaman Baru",
          link: "/peminjaman/pinjam",
        },
        {
          id: "3.3",
          title: "Pengaturan",
          link: "/pengaturan",
        },
      ],
    },
    {
      id: "4",
      title: "Keanggotaan",
      icon: "fa fa-users",
      children: [
        {
          id: "4.1",
          title: "Kelola Anggota",
          link: "/members",
        },
        {
          id: "4.2",
          title: "Tambah Anggota",
          link: "/member/tambah",
        },
      ],
    },
  ];
};

export default menuData;
