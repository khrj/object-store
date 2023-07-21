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
						openssl
						nodePackages.prisma
					];
					shellHook = ''
						export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
						export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
						export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
						export PRISMA_FMT_BINARY="${pkgs.prisma-engines}/bin/prisma-fmt"
					'';
				};
			}
		);
}
