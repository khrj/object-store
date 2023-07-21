{
	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable-small";
		flake-utils.url = "github:numtide/flake-utils";
	};

	outputs = { self, nixpkgs, flake-utils }:
		flake-utils.lib.eachDefaultSystem (system:
			let pkgs = import nixpkgs { inherit system; config = { allowUnfree = true; }; };
			in {
				devShell = pkgs.mkShell {
					buildInputs = with pkgs; [
						nodejs_20
					];
				};
			}
		);
}
