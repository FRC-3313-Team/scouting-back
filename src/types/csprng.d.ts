declare module "csprng" {
  function csprng(bit: number, radix: number): string;
  namespace csprng { }
  export = csprng;
}
