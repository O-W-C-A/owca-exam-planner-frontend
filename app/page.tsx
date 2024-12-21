import Link from 'next/link';

export default function Component() {
  return (
    //link to dashboard/inbox

    <Link href="/dashboard/inbox">Dashboard</Link>

    // <Navbar fluid rounded>
    //   <NavbarBrand href="https://flowbite-react.com">
    //     <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
    //       Aplicatie orar usv
    //     </span>
    //   </NavbarBrand>
    //   <div className="flex md:order-2">
    //     <Dropdown
    //       arrowIcon={false}
    //       inline
    //       label={
    //         <Avatar
    //           alt="User settings"
    //           img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
    //           rounded
    //         />
    //       }
    //     >
    //       <DropdownHeader>
    //         <span className="block text-sm">Stas Daniel</span>
    //         <span className="block truncate text-sm font-medium">
    //           name@usv.com
    //         </span>
    //       </DropdownHeader>
    //       <DropdownDivider />
    //       <DropdownItem>Sign out</DropdownItem>
    //     </Dropdown>
    //     <NavbarToggle />
    //   </div>
    //   <NavbarCollapse>
    //     <NavbarLink href="#" active>
    //       Orar
    //     </NavbarLink>
    //     <NavbarLink href="dashboard/inbox">Examenele tale</NavbarLink>
    //   </NavbarCollapse>
    // </Navbar>
  );
}
