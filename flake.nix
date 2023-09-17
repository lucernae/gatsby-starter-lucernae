{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
    devshell.url = "github:numtide/devshell";
  };

  outputs = { self, nixpkgs, flake-utils, devshell, ... }:
    flake-utils.lib.eachDefaultSystem (system: {
      devShell =
        let
          pkgs = import nixpkgs {
            inherit system;
            overlays = [ devshell.overlay ];
          };
          customNodejs = pkgs.nodejs-_x.override {
            openssl = pkgs.openssl_1_1;
          };
          bunV1 = pkgs.bun.overrideAttrs (final: prev: with pkgs; prev // rec {
            version = "1.0.2";
            src = passthru.sources.${stdenvNoCC.hostPlatform.system} or (throw "Unsupported system: ${stdenvNoCC.hostPlatform.system}");
            passthru = prev.passthru // {
              sources =  prev.passthru.sources // {
                "aarch64-darwin" = fetchurl {
                  url = "https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-darwin-aarch64.zip";
                  sha256 = "sha256-QvoEakfR5wmP10d6MDpfS8THke975bVyZc5pLVliUbQ=";
                };
              };
            };
          });
        in
        pkgs.devshell.mkShell {
          name = "gatsby-starter-lucernae";
          commands = [
            {
              name = "yarn";
              package = pkgs.yarn.override {
                nodejs = bunV1;
              };
            }
            {
              name = "yarn2nix";
              package = pkgs.yarn2nix;
            }
            {
              name = "node";
              package = pkgs.nodejs;
            }
            {
              name = "bun";
              package = bunV1;
            }
          ];
          packages = [
            # (pkgs.writeShellScriptBin "node" ''exec -a node bun "$@"'')
            # (pkgs.writeShellScriptBin "yarn" ''exec -a yarn bun "$@"'')
           ];
          env = [];
        };
    });
}
